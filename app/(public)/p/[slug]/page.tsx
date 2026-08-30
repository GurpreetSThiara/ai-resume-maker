import { notFound } from "next/navigation"
import { Metadata } from "next"
import { getPortfolioBySlug } from "@/services/portfolioService"
import { PortfolioView } from "@/components/public/portfolio-view"
import { SITE_URL, truncateForMeta } from "@/lib/seo"

export const revalidate = 300

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

    const title = truncateForMeta(`${portfolio.title} | Portfolio`, 60)
    const description = truncateForMeta(`Check out ${portfolio.title}'s professional portfolio created with Resume Builder.`, 160)

    return {
        title,
        description,
        alternates: {
            canonical: `${SITE_URL}/p/${slug}`,
        },
        openGraph: {
            title: portfolio.title,
            description: `Check out ${portfolio.title}'s professional portfolio.`,
            type: "website",
            images: [
                {
                    url: "/og-image.png",
                    width: 1200,
                    height: 630,
                    alt: `${portfolio.title}'s portfolio on CreateFreeCV`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title: portfolio.title,
            description: `Check out ${portfolio.title}'s professional portfolio.`,
            images: ["/og-image.png"],
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
