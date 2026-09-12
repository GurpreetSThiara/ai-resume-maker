import { describe, expect, it } from "vitest"
import {
  initializeSectionOrder,
  sortSectionsByOrder,
} from "@/utils/sectionOrdering"
import type { Section } from "@/types/resume"

/** Minimal section shaped just enough for the ordering helpers. */
const section = (id: string, order?: number) =>
  ({ id, title: id, type: "custom", content: [], ...(order === undefined ? {} : { order }) }) as unknown as Section

describe("initializeSectionOrder", () => {
  it("assigns each unordered section its index", () => {
    const out = initializeSectionOrder([section("a"), section("b"), section("c")])
    expect(out.map((s) => s.order)).toEqual([0, 1, 2])
  })

  it("preserves an order that is already set", () => {
    const out = initializeSectionOrder([section("a", 5), section("b")])
    expect(out.map((s) => s.order)).toEqual([5, 1])
  })

  it("keeps order 0, which is falsy and easy to clobber", () => {
    expect(initializeSectionOrder([section("a", 0)])[0].order).toBe(0)
  })

  it("does not mutate the input", () => {
    const input = [section("a")]
    initializeSectionOrder(input)
    expect((input[0] as { order?: number }).order).toBeUndefined()
  })
})

describe("sortSectionsByOrder", () => {
  it("sorts by the order field", () => {
    const out = sortSectionsByOrder([section("c", 2), section("a", 0), section("b", 1)])
    expect(out.map((s) => s.id)).toEqual(["a", "b", "c"])
  })

  it("does not mutate the input array", () => {
    const input = [section("c", 2), section("a", 0)]
    sortSectionsByOrder(input)
    expect(input.map((s) => s.id)).toEqual(["c", "a"])
  })

  it("falls back to position for sections with no order", () => {
    const out = sortSectionsByOrder([section("a"), section("b")])
    expect(out.map((s) => s.id)).toEqual(["a", "b"])
  })
})
