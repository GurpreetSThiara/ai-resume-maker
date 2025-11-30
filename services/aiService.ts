import { AI_PARSE } from "@/config/urls"

export const parseResume = async (text: string) => {
  try {
    const response = await fetch(AI_PARSE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      throw new Error(`Failed to parse resume: ${response.statusText}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error parsing resume:", error)
    return null
  }
}
