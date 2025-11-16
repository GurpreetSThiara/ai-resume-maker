import { openRouter } from "@/lib/openrouter"
import { createServerComponentClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"
export const dynamic = "force-dynamic"

export async function POST(request: Request) {
      const supabase = await createServerComponentClient()
  let { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const authHeader = request.headers.get("authorization") || request.headers.get("Authorization")
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined
    if (token) {
      const { data: userFromToken } = await supabase.auth.getUser(token)
      user = userFromToken.user
    }
  }
  try {
    const names = (await cookies()).getAll().map(c => c.name)
  } catch {}

  if (!user?.id) {
    return new Response("Unauthorized", { status: 401 })
  }

  try {
    const { text } = await request.json()
    if (!text || typeof text !== "string") {
      return new Response("Missing rawText", { status: 400 })
    }

const systemPrompt = `
You are a professional resume parser and structured data extractor.

Your task is to analyze raw resume text and produce a single **valid minified JSON** that exactly matches the schema defined below.

Return only the the valid JSON (no explanations, no markdown, no code fences, no natural language).

---

🎯 OBJECTIVE:
Parse the given resume text and output an object of type \`ResumeData\` as defined below.

---

### 🔹 ResumeData Schema

{
  "basics": {
    "name": "string",
    "email": "string",
    "phone": "string",
    "location": "string",
    "linkedin": "string",
    "summary": "string"
  },

  "custom": {
    "[key: string]": {
      "title": "string",
      "content": "string",
      "hidden": false,
      "id": "string",
      "link": false
    }
  },

  "sections": [
    {
      "id": "education-section",
      "title": "Education",
      "type": "education",
      "items": [
        {
          "institution": "string",
          "degree": "string",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM",
          "location": "string",
          "highlights": ["string"]
        }
      ]
    },
    {
      "id": "experience-section",
      "title": "Experience",
      "type": "experience",
      "items": [
        {
          "company": "string",
          "role": "string",
          "startDate": "YYYY-MM",
          "endDate": "YYYY-MM or 'Present'",
          "location": "string",
          "achievements": ["string"]
        }
      ]
    },
    {
      "id": "projects-section",
      "title": "Projects",
      "type": "projects",
      "items": [
        {
          "name": "string",
          "link": "string (optional)",
          "repo": "string (optional)",
          "description": ["string"]
        }
      ]
    },
    {
      "id": "skills-section",
      "title": "Skills",
      "type": "skills",
      "items": ["string"]
    },
    {
      "id": "languages-section",
      "title": "Languages",
      "type": "languages",
      "items": ["string"]
    },
    {
      "id": "certifications-section",
      "title": "Certifications",
      "type": "certifications",
      "items": ["string"]
    },
    {
      "id": "custom-section",
      "title": "Custom",
      "type": "custom",
      "content": ["string"]
    }
  ]
}

---

### 🔹 Field Semantics (Type Awareness)

- **ResumeData.basics** → Basic user information; must always exist.
- **ResumeData.custom** → Arbitrary additional fields (e.g., GitHub, Portfolio). Each key must map to an object of type \`CustomField\`.
- **ResumeData.sections** → An array of section objects.  
  Each must have:
  - \`id\`: unique string ID (e.g., "education-section")
  - \`title\`: human-readable title (e.g., "Education")
  - \`type\`: one of the allowed SectionType values below.
  - \`items\` or \`content\`: depending on type.

Allowed \`SectionType\` values:
- "education"
- "experience"
- "projects"
- "skills"
- "languages"
- "certifications"
- "custom"

### 🔹 Type Reference

CustomField = {
  "title": "string",
  "content": "string",
  "hidden": false,
  "id": "string",
  "link": false
}

Education = {
  "institution": "string",
  "degree": "string",
  "startDate"?: "YYYY-MM",
  "endDate"?: "YYYY-MM",
  "location"?: "string",
  "highlights"?: ["string"]
}

Experience = {
  "company": "string",
  "role": "string",
  "startDate": "YYYY-MM",
  "endDate": "YYYY-MM or 'Present'",
  "location"?: "string",
  "achievements"?: ["string"]
}

Project = {
  "name": "string",
  "link"?: "string",
  "repo"?: "string",
  "description"?: ["string"]
}

---

### 🧩 Output Rules

- Output **only valid JSON** (no comments, no markdown, no explanations).
- Always include:
  - "basics"
  - "custom"
  - "sections" (as an array of section objects — never keyed objects)
- If any section doesn’t exist, output it with an empty array or empty content.
- Dates must use "YYYY-MM" or "Present".
- Escape all internal quotes properly.
- Output must be **parsable by JSON.parse()** with no post-processing required.
- Ensure consistency with the ResumeData type definition.

---

Now, based on the raw resume text provided by the user, generate the ResumeData JSON object.
`

    const response = await openRouter.chat.completions.create({
      model: "deepseek/deepseek-chat-v3.1:fre",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    })

    const result = response.choices?.[0]?.message?.content?.trim()
    if (!result) return new Response("No response from model", { status: 500 })

    try {
      const parsed = JSON.parse(result)
      return Response.json(parsed)
    } catch {
      // fallback if AI didn’t return valid JSON
      return new Response(result, { status: 200 })
    }

  } catch (error) {
    console.error("Error generating resume:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
