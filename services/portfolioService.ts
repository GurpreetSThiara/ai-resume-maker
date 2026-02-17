import { supabase } from "@/lib/supabase/client"
import { Database } from "@/lib/supabase/types"

type Portfolio = Database["public"]["Tables"]["portfolios"]["Row"]
type PortfolioInsert = Database["public"]["Tables"]["portfolios"]["Insert"]
type PortfolioUpdate = Database["public"]["Tables"]["portfolios"]["Update"]

export async function createPortfolio(data: Omit<PortfolioInsert, "user_id">): Promise<{ success: boolean; data?: Portfolio; error?: string; message?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data: portfolio, error } = await (supabase
            .from("portfolios") as any)
            .insert({ ...data, user_id: user.id })
            .select()
            .single()

        if (error) throw error
        return { success: true, data: portfolio, message: "Portfolio created successfully" }
    } catch (error: any) {
        console.error("Error creating portfolio:", error)
        return { success: false, error: error.message, message: "Failed to create portfolio" }
    }
}

export async function getPortfolioBySlug(slug: string): Promise<{ success: boolean; data?: Portfolio; error?: string }> {
    try {
        const { data: portfolio, error } = await (supabase
            .from("portfolios") as any)
            .select("*")
            .eq("slug", slug)
            .single()

        if (error) throw error
        return { success: true, data: portfolio }
    } catch (error: any) {
        console.error("Error fetching portfolio:", error)
        return { success: false, error: error.message }
    }
}

export async function getPortfolioById(id: string): Promise<{ success: boolean; data?: Portfolio; error?: string }> {
    try {
        const { data: portfolio, error } = await (supabase
            .from("portfolios") as any)
            .select("*")
            .eq("id", id)
            .single()

        if (error) throw error
        return { success: true, data: portfolio }
    } catch (error: any) {
        console.error("Error fetching portfolio:", error)
        return { success: false, error: error.message }
    }
}

export async function updatePortfolio(id: string, updates: PortfolioUpdate): Promise<{ success: boolean; data?: Portfolio; error?: string; message?: string }> {
    try {
        const { data: portfolio, error } = await (supabase
            .from("portfolios") as any)
            .update(updates)
            .eq("id", id)
            .select()
            .single()

        if (error) throw error
        return { success: true, data: portfolio, message: "Portfolio updated successfully" }
    } catch (error: any) {
        console.error("Error updating portfolio:", error)
        return { success: false, error: error.message, message: "Failed to update portfolio" }
    }
}

export async function getUserPortfolios(): Promise<{ success: boolean; data?: Portfolio[]; error?: string }> {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) throw new Error("User not authenticated")

        const { data: portfolios, error } = await (supabase
            .from("portfolios") as any)
            .select("*")
            .eq("user_id", user.id)
            .order("updated_at", { ascending: false })

        if (error) throw error
        return { success: true, data: portfolios }
    } catch (error: any) {
        console.error("Error fetching user portfolios:", error)
        return { success: false, error: error.message, data: [] }
    }
}

export async function deletePortfolio(id: string) {
    try {
        const { error } = await supabase
            .from("portfolios")
            .delete()
            .eq("id", id)

        if (error) throw error
        return { success: true, message: "Portfolio deleted successfully" }
    } catch (error: any) {
        console.error("Error deleting portfolio:", error)
        return { success: false, error: error.message, message: "Failed to delete portfolio" }
    }
}

// Check if slug is available
export async function checkSlugAvailability(slug: string) {
    try {
        const { data, error } = await supabase
            .from("portfolios")
            .select("id")
            .eq("slug", slug)
            .maybeSingle()

        if (error) throw error
        return { available: !data }
    } catch (error: any) {
        console.error("Error checking slug:", error)
        return { available: false }
    }
}
