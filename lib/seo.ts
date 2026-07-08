/**
 * Central source of truth for structured-data (schema.org / JSON-LD) builders.
 * Keeping these here avoids drift between pages and the sitemap.
 */

export const SITE_URL = "https://createfreecv.com"
export const SITE_NAME = "CreateFreeCV"
export const SITE_LOGO = `${SITE_URL}/android-chrome-512x512.png`

/** Absolute URL helper — accepts a path ("/blog") or an already-absolute URL. */
export function absoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//.test(pathOrUrl)) return pathOrUrl
  return `${SITE_URL}${pathOrUrl.startsWith("/") ? "" : "/"}${pathOrUrl}`
}

/** Publisher block reused by Article/WebSite schemas. */
const publisher = {
  "@type": "Organization",
  name: SITE_NAME,
  logo: {
    "@type": "ImageObject",
    url: SITE_LOGO,
  },
}

/** Global Organization identity. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
  }
}

/** Global WebSite entity with a sitelinks search box. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
  }
}

/** The resume builder itself, as a free WebApplication. */
export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `${SITE_NAME} — Free ATS Resume Builder`,
    url: `${SITE_URL}/free-ats-resume-templates`,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher,
  }
}

export interface ArticleSchemaInput {
  title: string
  description: string
  slug: string
  image?: string
  author?: string
  publishedAt?: string
}

/** Article + its breadcrumb trail for a blog post. Returns an array. */
export function blogPostSchema(post: ArticleSchemaInput) {
  const url = `${SITE_URL}/blog/${post.slug}`
  const article = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.image ? absoluteUrl(post.image) : SITE_LOGO,
    author: {
      "@type": "Organization",
      name: post.author || `${SITE_NAME} Team`,
    },
    publisher,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }
  return [article, breadcrumbSchema([
    { name: "Home", url: SITE_URL },
    { name: "Blog", url: `${SITE_URL}/blog` },
    { name: post.title, url },
  ])]
}

export interface BreadcrumbItem {
  name: string
  url: string
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export interface FaqItem {
  question: string
  answer: string
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }
}

export interface HowToStep {
  name: string
  text: string
}

export function howToSchema(input: { name: string; description: string; steps: HowToStep[] }) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
    })),
  }
}
