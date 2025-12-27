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
      // If status is 422 (Unprocessable Entity), it means parsing failed and should retry
      if (response.status === 422) {
        const errorData = await response.json()
        console.error("AI parsing failed, will retry:", errorData.error)
        return null // Return null to trigger retry
      }
      throw new Error(`Failed to parse resume: ${response.statusText}`)
    }

    let result = await response.json()
    
    // If result is a string, try to parse it as JSON
    if (typeof result === 'string') {
      try {
        result = JSON.parse(result)
      } catch (parseError) {
        console.error("Failed to parse stringified response:", parseError)
        return null // Return null to trigger retry
      }
    }
    
    // Validate that the result has the expected structure
    if (!result || typeof result !== 'object' || !result.basics || !result.sections) {
      console.error("Invalid resume data structure:", result)
      return null // Return null to trigger retry
    }
    
    return result
  } catch (error) {
    console.error("Error parsing resume:", error)
    return null
  }
}
