import { openRouter } from "@/lib/openrouter"
export const dynamic = "force-dynamic"

// Retry configuration
const MAX_RETRIES = 3
const INITIAL_DELAY = 1000 // 1 second

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function callAIWithRetry(text: string, systemPrompt: string, retries = 0): Promise<any> {
  try {
    const client = openRouter()
    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b:free",
      temperature: 0.3,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
    })

    const result = response.choices?.[0]?.message?.content?.trim()
    if (!result) throw new Error("No response from model")

    // Try to parse as JSON first
    try {
      const parsed = JSON.parse(result)
      return parsed
    } catch (parseError) {
      // If direct parsing fails, try to extract JSON from the response
      try {
        const jsonMatch = result.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const extractedJson = jsonMatch[0];
          const parsed = JSON.parse(extractedJson);
          return parsed;
        }
      } catch (extractError) {
        console.error("Failed to extract JSON from response:", extractError);
      }
      
      throw new Error("Invalid JSON response from AI service")
    }

  } catch (error: any) {
    // If it's a 429 error and we have retries left, wait and retry
    if (error.status === 429 && retries < MAX_RETRIES) {
      const delay = INITIAL_DELAY * Math.pow(2, retries) // Exponential backoff
      console.log(`Rate limited. Retrying in ${delay}ms... (attempt ${retries + 1}/${MAX_RETRIES})`)
      await sleep(delay)
      return callAIWithRetry(text, systemPrompt, retries + 1)
    }
    
    // For other errors or no retries left, throw the error
    throw error
  }
}

export async function POST(request: Request) {

  try {
    const { text } = await request.json()
    if (!text || typeof text !== "string") {
      return new Response("Missing rawText", { status: 400 })
    }

    // Enforce 1MB limit on input text (1MB = 1048576 bytes)
    const MAX_FILE_SIZE_MB = 1
    const MAX_TEXT_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024
    const textBytes = new TextEncoder().encode(text).length
    if (textBytes > MAX_TEXT_BYTES) {
      return new Response(
        JSON.stringify({ 
          error: `Resume file exceeds ${MAX_FILE_SIZE_MB}MB limit. Current size: ${(textBytes / 1024 / 1024).toFixed(2)}MB` 
        }),
        { status: 413 }
      )
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
- If any section doesn't exist, output it with an empty array or empty content.
- Dates must use "YYYY-MM" or "Present".
- Escape all internal quotes properly.
- Output must be **parsable by JSON.parse()** with no post-processing required.
- Ensure consistency with the ResumeData type definition.

---

Now, based on the raw resume text provided by the user, generate the ResumeData JSON object.
`

    try {
      const parsed = await callAIWithRetry(text, systemPrompt)
      return Response.json(parsed)
    } catch (error: any) {
      console.error("Error generating resume:", error)
      
      // Handle specific error types
      if (error.status === 429) {
        return new Response(
          JSON.stringify({ 
            error: "AI service is temporarily rate limited. Please try again in a few moments.",
            code: "RATE_LIMITED"
          }),
          { status: 429 }
        )
      }
      
      if (error.message?.includes("Invalid JSON response")) {
        return new Response(
          JSON.stringify({ 
            error: "AI service returned invalid response. Please try again.",
            code: "INVALID_RESPONSE"
          }),
          { status: 422 }
        )
      }
      
      return new Response("Internal Server Error", { status: 500 })
    }

  } catch (error) {
    console.error("Error generating resume:", error)
    return new Response("Internal Server Error", { status: 500 })
  }
}
