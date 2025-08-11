import { supabase } from "./supabase/client"

export async function ensureUserProfile() {
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    // Try to fetch existing profile
    const { data: existing, error: fetchError } = await supabase
      .from("profiles")
      .select("id, email")
      .eq("id", user.id)
      .single()

    if (fetchError && fetchError.code !== "PGRST116") {
      // PGRST116 = No rows found; ignore other errors
      return
    }

    const payload = {
      id: user.id,
      email: user.email || "",
      full_name: (user.user_metadata as any)?.full_name || null,
      updated_at: new Date().toISOString(),
    }

    if (!existing) {
      // Insert new profile; profiles.email has UNIQUE constraint which enforces one account per email
      await supabase.from("profiles").insert(payload as any)
    } else if (existing.email !== user.email) {
      // Keep email in sync
      await supabase.from("profiles").update({ email: user.email || "" } as any).eq("id", user.id)
    }
  } catch (err) {
    console.warn("ensureUserProfile skipped:", err)
  }
}


