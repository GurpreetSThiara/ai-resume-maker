import { describe, expect, it } from "vitest"
import { SITE_URL, absoluteUrl, truncateForMeta } from "@/lib/seo"
import { consentRegionForCountry } from "@/lib/consent-region"

describe("absoluteUrl", () => {
  it("leaves an absolute URL alone", () => {
    expect(absoluteUrl("https://example.com/x")).toBe("https://example.com/x")
    expect(absoluteUrl("http://example.com/x")).toBe("http://example.com/x")
  })

  it("prefixes a path with the canonical origin", () => {
    expect(absoluteUrl("/blog")).toBe(`${SITE_URL}/blog`)
  })

  it("inserts the missing slash rather than concatenating blindly", () => {
    expect(absoluteUrl("blog")).toBe(`${SITE_URL}/blog`)
  })
})

describe("truncateForMeta", () => {
  it("leaves text within the limit untouched", () => {
    expect(truncateForMeta("short", 20)).toBe("short")
  })

  it("backs off to a word boundary rather than cutting a word in half", () => {
    const out = truncateForMeta("the quick brown fox jumps", 16)
    expect(out.endsWith("…")).toBe(true)
    expect(out).not.toMatch(/jum…$/)
    expect(out.length).toBeLessThanOrEqual(16)
  })

  it("strips trailing punctuation before the ellipsis", () => {
    expect(truncateForMeta("alpha, beta gamma delta", 12)).not.toMatch(/[,;:.\-]…$/)
  })

  it("hard-slices when the first word is itself longer than the limit", () => {
    const out = truncateForMeta("supercalifragilistic", 10)
    expect(out.endsWith("…")).toBe(true)
    expect(out.length).toBeLessThanOrEqual(10)
  })
})

describe("consentRegionForCountry", () => {
  it("treats EU, EEA, UK and Switzerland as opt-in", () => {
    for (const c of ["DE", "FR", "IE", "NO", "IS", "LI", "GB", "CH"]) {
      expect(consentRegionForCountry(c)).toBe("opt-in")
    }
  })

  it("treats everywhere else as opt-out", () => {
    for (const c of ["US", "IN", "AU", "BR", "JP"]) {
      expect(consentRegionForCountry(c)).toBe("opt-out")
    }
  })

  it("is case-insensitive", () => {
    expect(consentRegionForCountry("de")).toBe("opt-in")
    expect(consentRegionForCountry("gB")).toBe("opt-in")
  })

  it("fails safe to opt-in when the country is unknown or missing", () => {
    // The direction that matters: no geo header must mean "show the banner and
    // withhold analytics", never "track them and hope they are not in the EU".
    expect(consentRegionForCountry("")).toBe("opt-in")
    expect(consentRegionForCountry(null)).toBe("opt-in")
    expect(consentRegionForCountry(undefined)).toBe("opt-in")
  })
})
