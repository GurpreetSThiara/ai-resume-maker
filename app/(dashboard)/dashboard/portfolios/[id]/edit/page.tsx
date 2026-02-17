"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { PortfolioEditor } from "@/components/dashboard/portfolio-editor"
import { getPortfolioById } from "@/services/portfolioService"
import { Loader2 } from "lucide-react"

export default function PortfolioEditorPage() {
    const params = useParams()
    const router = useRouter()
    const [portfolio, setPortfolio] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (params.id) {
            loadPortfolio(params.id as string)
        }
    }, [params.id])

    async function loadPortfolio(id: string) {
        const result = await getPortfolioById(id)
        if (result.success) {
            setPortfolio(result.data)
        } else {
            // Handle error or redirect
            router.push("/dashboard/portfolios")
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!portfolio) return null

    return <PortfolioEditor portfolio={portfolio} />
}
