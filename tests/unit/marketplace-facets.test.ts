import { describe, expect, it } from "vitest"
import {
  DEFAULT_FILTERS,
  TEMPLATES,
  countActiveFilters,
  facetCounts,
  filterAndSort,
  groupFamilies,
  type Filters,
} from "@/app/free-ats-resume-templates/_marketplace/data"
import { colorFamilyOf } from "@/app/free-ats-resume-templates/_marketplace/facets"

const withFilters = (patch: Partial<Filters>): Filters => ({ ...DEFAULT_FILTERS, ...patch })
const familyCount = (f: Filters) => groupFamilies(filterAndSort(TEMPLATES, f)).length

describe("colorFamilyOf", () => {
  it("buckets by hue", () => {
    expect(colorFamilyOf("#1d4ed8")).toBe("blue")
    expect(colorFamilyOf("#15803d")).toBe("green")
    expect(colorFamilyOf("#b91c1c")).toBe("red")
    expect(colorFamilyOf("#6d28d9")).toBe("purple")
  })

  it("calls near-greys neutral whatever hue they lean towards", () => {
    // The reason saturation is checked before hue: charcoal and slate would
    // otherwise scatter across three different colour filters.
    expect(colorFamilyOf("#374151")).toBe("neutral")
    expect(colorFamilyOf("#111827")).toBe("neutral")
    expect(colorFamilyOf("#1e293b")).toBe("neutral")
  })

  it("accepts a hex with or without the leading hash", () => {
    expect(colorFamilyOf("1d4ed8")).toBe(colorFamilyOf("#1d4ed8"))
  })
})

describe("filterAndSort", () => {
  it("returns the whole catalog when nothing is selected", () => {
    expect(filterAndSort(TEMPLATES, DEFAULT_FILTERS)).toHaveLength(TEMPLATES.length)
  })

  it("ORs options within a facet group", () => {
    const left = familyCount(withFilters({ layouts: ["sidebar-left"] }))
    const right = familyCount(withFilters({ layouts: ["sidebar-right"] }))
    const both = familyCount(withFilters({ layouts: ["sidebar-left", "sidebar-right"] }))
    expect(both).toBe(left + right)
  })

  it("ANDs across facet groups", () => {
    const layoutOnly = familyCount(withFilters({ layouts: ["single"] }))
    const narrowed = familyCount(withFilters({ layouts: ["single"], fonts: ["serif"] }))
    expect(narrowed).toBeLessThanOrEqual(layoutOnly)
  })

  it("ANDs tags, which narrow rather than widen", () => {
    const ats = filterAndSort(TEMPLATES, withFilters({ tags: ["ATS"] }))
    const atsClassic = filterAndSort(TEMPLATES, withFilters({ tags: ["ATS", "Classic"] }))
    expect(atsClassic.length).toBeLessThanOrEqual(ats.length)
    expect(atsClassic.every((t) => t.tags.includes("ATS") && t.tags.includes("Classic"))).toBe(true)
  })

  it("respects the minimum ATS score", () => {
    const strict = filterAndSort(TEMPLATES, withFilters({ minAts: 98 }))
    expect(strict.length).toBeGreaterThan(0)
    expect(strict.every((t) => t.atsScore >= 98)).toBe(true)
  })

  it("matches the search query against name, description, category and tags", () => {
    const hits = filterAndSort(TEMPLATES, withFilters({ query: "developer" }))
    expect(hits.length).toBeGreaterThan(0)
  })

  it("returns nothing for a query that matches nothing, rather than everything", () => {
    expect(filterAndSort(TEMPLATES, withFilters({ query: "zzzznomatch" }))).toHaveLength(0)
  })

  it("sorts by the requested key", () => {
    const byAts = filterAndSort(TEMPLATES, withFilters({ sort: "ats" }))
    const scores = byAts.map((t) => t.atsScore)
    expect([...scores].sort((a, b) => b - a)).toEqual(scores)

    const az = filterAndSort(TEMPLATES, withFilters({ sort: "az" })).map((t) => t.name)
    expect([...az].sort((a, b) => a.localeCompare(b))).toEqual(az)
  })
})

describe("facetCounts", () => {
  it("counts families, not colour variants", () => {
    const counts = facetCounts(DEFAULT_FILTERS)
    const layoutTotal = Object.values(counts.layouts).reduce((a, b) => a + b, 0)
    expect(layoutTotal).toBe(familyCount(DEFAULT_FILTERS))
  })

  it("leaves a group's own counts unchanged when one of its options is selected", () => {
    // The point of relaxing the group being counted: picking one colour must
    // not collapse every other colour to zero, or the filter is unusable.
    const base = facetCounts(DEFAULT_FILTERS).layouts
    const afterPick = facetCounts(withFilters({ layouts: ["single"] })).layouts
    expect(afterPick).toEqual(base)
  })

  it("narrows other groups when a facet is selected", () => {
    const base = facetCounts(DEFAULT_FILTERS).fonts
    const narrowed = facetCounts(withFilters({ layouts: ["sidebar-left"] })).fonts
    const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0)
    expect(sum(narrowed)).toBeLessThan(sum(base))
  })

  it("agrees with what filterAndSort actually returns", () => {
    const counts = facetCounts(DEFAULT_FILTERS)
    for (const [layout, n] of Object.entries(counts.layouts)) {
      expect(familyCount(withFilters({ layouts: [layout as never] }))).toBe(n)
    }
  })
})

describe("countActiveFilters", () => {
  it("is zero for the default filters", () => {
    expect(countActiveFilters(DEFAULT_FILTERS)).toBe(0)
  })

  it("counts each selected option and the ATS threshold", () => {
    expect(countActiveFilters(withFilters({ layouts: ["single"], minAts: 95 }))).toBe(2)
    expect(countActiveFilters(withFilters({ colors: ["blue", "green"], tags: ["ATS"] }))).toBe(3)
  })

  it("ignores the query and the sort, which do not narrow by facet", () => {
    expect(countActiveFilters(withFilters({ query: "x", sort: "az" }))).toBe(0)
  })
})

describe("groupFamilies", () => {
  it("collapses colour variants of one layout into a single card", () => {
    const families = groupFamilies(TEMPLATES)
    expect(families.length).toBeLessThan(TEMPLATES.length)
    expect(families.every((f) => f.variants.length > 0)).toBe(true)
  })

  it("de-duplicates identical colours within a family", () => {
    for (const family of groupFamilies(TEMPLATES)) {
      const colours = family.variants.map((v) => v.colorName)
      expect(new Set(colours).size).toBe(colours.length)
    }
  })
})
