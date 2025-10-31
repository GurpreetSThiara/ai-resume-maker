import { openRouter } from "@/lib/openrouter"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies: cookies() })
  const { data: { session } } = await supabase.auth.getSession()
  
  if (!session?.user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }
  
  // Check remaining credits
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credits_remaining')
    .eq('id', session.user.id)
    .single()

  if (profileError || !profile) {
    return new Response("Error fetching user profile", { status: 500 })
  }

  if (profile.credits_remaining <= 0) {
    return new Response("No credits remaining", { status: 403 })
  }

  try {
    const { name, experience, skills, education } = await request.json()

    const prompt = `Generate a compelling professional summary for ${name}'s resume. Here is their background:

Experience:
${experience?.map((exp: any) => `- ${exp.role} at ${exp.company} (${exp.startDate} - ${exp.endDate})
  Key achievements: ${exp.achievements?.join(", ")}`).join("\n") || "No experience provided"}

Skills:
${skills?.join(", ") || "No skills provided"}

Education:
${education?.map((edu: any) => `- ${edu.degree} from ${edu.institution} (${edu.startDate} - ${edu.endDate})`).join("\n") || "No education provided"}

Please write a concise, professional summary (2-3 sentences) that:
1. Highlights their years of experience and key expertise
2. Mentions their most significant achievements
3. Focuses on their unique value proposition
4. Uses active voice and powerful action verbs
5. Keeps it under 100 words`

    const response = await openRouter.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a professional resume writer who creates compelling, concise professional summaries.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "openai/gpt-oss-20b:free",
      temperature: 0.7,
    })

    const summary = response.choices[0]?.message?.content?.trim()

    if (!summary) {
      throw new Error("Failed to generate summary")
    }

    // Deduct one credit
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ 
        credits_remaining: profile.credits_remaining - 1,
        last_activity: new Date().toISOString()
      })
      .eq('id', session.user.id)

    if (updateError) {
      throw new Error("Failed to update credits")
    }

    return new Response(JSON.stringify({ 
      summary,
      creditsRemaining: profile.credits_remaining - 1 
    }), {
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("Error in generate-summary:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
