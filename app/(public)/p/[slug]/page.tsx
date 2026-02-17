import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPortfolioBySlug } from "@/services/portfolioService"
import { PortfolioView } from "@/components/public/portfolio-view"

interface PageProps {
    params: Promise<{
        slug: string
    }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params
    const { data: portfolio } = await getPortfolioBySlug(slug)

    if (!portfolio) {
        return {
            title: "Portfolio Not Found",
        }
    }

    return {
        title: `${portfolio.title} | Portfolio`,
        description: `Check out ${portfolio.title}'s professional portfolio created with Resume Builder.`,
        openGraph: {
            title: portfolio.title,
            description: `Check out ${portfolio.title}'s professional portfolio.`,
            type: "website",
        },
    }
}

export default async function PublicPortfolioPage({ params }: PageProps) {
    const { slug } = await params
    const { data: portfolio, error } = await getPortfolioBySlug(slug)

    if (error || !portfolio) {
        notFound()
    }

    if (!portfolio.is_public) {
        notFound()
    }

    return <PortfolioView portfolio={portfolio} />
}
