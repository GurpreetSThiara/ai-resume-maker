import { AI_PARSE } from "@/config/urls"
import { supabase } from "@/lib/supabase/client"

export const parseResume = async (text: string) => {
  try {
    const { data: sessionData } = await supabase.auth.getSession()
    const accessToken = sessionData.session?.access_token
    const response = await fetch(AI_PARSE, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
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
