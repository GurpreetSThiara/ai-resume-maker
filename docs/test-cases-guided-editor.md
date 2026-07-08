# Guided Editor — Resume Generation Test Cases

**Scope:** The **Guided editor** at `/free-ats-resume-templates/create` (editor mode = *Guided*, the default). Covers the system-generated resume across the on-screen **Editable** preview and the **PDF** / **DOCX** downloads. The Visual (beta) editor is out of scope.

**How to run:** Unless a case says otherwise, start from a fresh resume (no saved `style`) on template **ATS Classic** and use the sample data seeded by "Load example" / default data. "Output" means all three surfaces (Editable preview, PDF, DOCX) unless a specific surface is named.

**Defaults under test (baseline expectations):**
- Page margins default to **Wide**.
- Education defaults to **Condensed** (one line: `Institution — Degree, Year, CGPA`; Location & Highlights hidden).
- Spacing (density) defaults to **Normal** (tight ChatGPT-like rhythm).
- Section headings render **plain** (no rule) on ATS Classic.

**Priority:** P1 = critical / must-pass, P2 = important, P3 = edge/nice-to-have.

**Result legend:** Pass / Fail / Blocked / N/A. Record actual vs expected on failure.

| Field | Meaning |
|---|---|
| ID | Stable identifier |
| Area | Feature group |
| Preconditions | State required before steps |
| Steps | Minimal actions |
| Expected result | Pass criteria |

---

## 1. Personal Info & Contact (TC-001–006)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-001 | Fresh resume | Enter Full Name in Personal Info | Name renders as the largest heading at top of the resume in all surfaces | P1 |
| TC-002 | Name set | Enter email, phone, location, LinkedIn | All four appear on one contact line, separated by the divider ` \| `, directly under the name | P1 |
| TC-003 | Contact set | Leave phone & LinkedIn empty; keep email + location | Contact line shows only the two filled fields with no dangling separators | P1 |
| TC-004 | LinkedIn set to a full URL | Inspect PDF | LinkedIn renders and (in PDF) is a clickable link annotation | P2 |
| TC-005 | Fresh resume | Leave every contact field empty, name only | Only the name shows; no empty contact line or stray separators | P2 |
| TC-006 | Name with accented/unicode chars (e.g., "José Łukasz") | Enter name | Characters render correctly in preview, PDF, and DOCX (no tofu/□) | P2 |

## 2. Professional Summary (TC-007–009)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-007 | Fresh resume | Enter a 3-line summary | Summary renders between the header and the first section on all surfaces | P1 |
| TC-008 | Summary empty | Leave summary blank | No empty summary block or gap is rendered | P2 |
| TC-009 | Summary very long (>600 chars) | Enter long summary | Text wraps cleanly, no clipping/overflow; flows to next page in PDF if needed | P2 |

## 3. Education & Condensed Mode (TC-010–022)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-010 | Fresh resume (condensed default ON) | Open Education step | "Condensed layout" toggle is **ON** by default; Location & Highlights inputs are hidden | P1 |
| TC-011 | Condensed ON | Fill Institution, Degree, Start, End, CGPA | Education renders as **one line**: `Institution — Degree, Start – End, CGPA` with institution bold | P1 |
| TC-012 | Condensed ON | Leave CGPA empty | One line renders without CGPA and without a trailing comma | P1 |
| TC-013 | Condensed ON | Leave Degree and dates empty, Institution only | Line shows just the bold institution, no ` — ` separator | P2 |
| TC-014 | Condensed ON | Add a CGPA value like "8.6 CGPA" | CGPA appears verbatim as the last item of the line | P1 |
| TC-015 | Condensed ON | Turn the toggle OFF | Location & Highlights inputs reappear; entries render as multi-line block with bullets | P1 |
| TC-016 | Condensed OFF | Add 3 highlight bullets | Bullets render under the entry in all surfaces | P1 |
| TC-017 | Condensed OFF → ON | Enter highlights, then switch to condensed | Highlights are hidden in output (not deleted); switching back restores them | P2 |
| TC-018 | Condensed ON | Add 3 education entries | All 3 render as separate one-line rows with consistent spacing | P1 |
| TC-019 | Condensed toggle | Toggle in Education step, then open Settings modal | The Settings modal "Condensed education" switch reflects the same state (single source) | P2 |
| TC-020 | Condensed ON | Verify PDF & DOCX | One-line format is identical across Editable, PDF, and DOCX | P1 |
| TC-021 | Condensed ON | Very long institution + degree | Line wraps gracefully; institution stays bold on the first line | P3 |
| TC-022 | Education section empty | Remove all education entries | Section is omitted from output (no empty "Education" heading) | P2 |

## 4. Experience (TC-023–029)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-023 | Fresh resume | Add role, company, dates, location | Renders with role/company bold, dates right-aligned, location shown | P1 |
| TC-024 | Experience set | Add 4 achievement bullets | Bullets render as a list under the entry in all surfaces | P1 |
| TC-025 | Experience set | Leave location empty | Entry renders without location; dates still right-aligned | P2 |
| TC-026 | Multiple roles | Add 3 experiences with varied dates | All render in entry order with consistent inter-entry spacing | P1 |
| TC-027 | Experience set | Enter "Present" as end date | Renders "Start – Present" | P2 |
| TC-028 | Experience with long bullets | Bullet >200 chars | Wraps within the content column, hanging indent preserved | P2 |
| TC-029 | Experience empty | No experiences | Section omitted from output | P2 |

## 5. Skills & Skill Styles (TC-030–036)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-030 | Fresh resume | Add skill groups (e.g., Frontend, Backend) with skills | Skills render grouped by category label | P1 |
| TC-031 | Skills set | Settings → Skills = **Pills** | Skills render as pill chips in all surfaces | P2 |
| TC-032 | Skills set | Settings → Skills = **Bullets** | Skills render as bulleted list | P2 |
| TC-033 | Skills set | Settings → Skills = **Bars** with levels on | Proficiency bars render per skill | P2 |
| TC-034 | Skills set | Settings → Skills = **Dots** | Proficiency dots render per skill | P3 |
| TC-035 | Skills with levels | Toggle "show levels" off | Bars/dots hidden; skills show as plain text/labels | P2 |
| TC-036 | Skills empty | No skills | Section omitted from output | P2 |

## 6. Languages / Certifications / Projects / Custom Fields (TC-037–044)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-037 | Fresh resume | Add 2 languages | Languages section renders with entries | P2 |
| TC-038 | Fresh resume | Add 2 certifications | Certifications render as list items | P2 |
| TC-039 | Fresh resume | Add a project with title, link, bullets | Project renders with title, link, and bullet details | P2 |
| TC-040 | Project link set | Inspect PDF | Project URL renders (clickable in PDF) | P3 |
| TC-041 | Fresh resume | Add a Custom Field (label + content) | Custom field renders under a "custom fields" area | P2 |
| TC-042 | Custom field with link=true | Add a link-type custom field | Renders as a link | P3 |
| TC-043 | All optional sections empty | Leave languages/certs/projects/custom empty | None of the empty sections appear in output | P1 |
| TC-044 | Certifications only | Only certifications filled | Only that section renders (plus core sections) | P2 |

## 7. Section Ordering & Visibility (TC-045–050)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-045 | Multiple sections | Reorder Experience above Education (Section management) | Output order matches the new order across all surfaces | P1 |
| TC-046 | Reordered | Reload / re-render | New order persists in the generated resume | P2 |
| TC-047 | Section visible | Hide a section via the visibility toggle | Hidden section is excluded from preview, PDF, DOCX | P1 |
| TC-048 | Section hidden | Re-enable the section | Section reappears with its data intact | P1 |
| TC-049 | Section hidden | Attempt to edit a hidden section's fields | Inputs are disabled with an "enable section" hint | P3 |
| TC-050 | Custom-fields section | Reorder custom-fields relative to others | Renders in the chosen position | P3 |

## 8. Template Selection & Rendering (TC-051–060)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-051 | Any resume | Open template picker | Templates listed with distinct names incl. **ATS Classic** and **ATS Classic Lines** | P1 |
| TC-052 | Fresh resume | Select **ATS Classic** | Renders with **no** rule lines under headings and **no** header rule | P1 |
| TC-053 | Fresh resume | Select **ATS Classic Lines** | Renders **with** black rule lines under each section heading | P1 |
| TC-054 | Template selected | Verify thumbnail vs render | Picker thumbnail matches the actual rendered output for that template | P2 |
| TC-055 | Home page | Click a template card on the home showcase | Redirects to `create?template=<id>` with that template preselected | P1 |
| TC-056 | Select **Classic Blue** | Choose it | Renders blue headings with rules; unaffected by ATS Classic changes | P2 |
| TC-057 | Select a sidebar template (Modern Sidebar) | Choose it | Two-column layout renders; sidebar holds skills/contact | P2 |
| TC-058 | Sidebar template | Switch layout to single column via Settings | Layout collapses to single column correctly | P2 |
| TC-059 | Any template | Switch template mid-edit | All entered data is preserved and re-renders in the new template | P1 |
| TC-060 | Designer/non-ATS template | Select it | `pdfOnly` templates hide the DOCX download; PDF still works | P3 |

## 9. Spacing (Density) & Margins (TC-061–068)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-061 | Fresh resume | Open Settings → Margins | Default selection is **Wide** | P1 |
| TC-062 | Margins = Wide | Switch to **Normal** | Page margins visibly tighten | P1 |
| TC-063 | Margins | Switch to **Compact** | Margins tighten further than Normal | P2 |
| TC-064 | Margins changed | Verify PDF & DOCX | Margin change reflected identically in both downloads | P1 |
| TC-065 | Fresh resume | Settings → Spacing default | Default is **Normal** with tight vertical rhythm | P1 |
| TC-066 | Spacing = Normal | Switch to **Relaxed** | Section/entry gaps grow noticeably | P1 |
| TC-067 | Spacing | Switch to **Compact** | Gaps shrink; more content fits per page | P2 |
| TC-068 | Spacing + Margins changed | Verify Editable vs PDF vs DOCX | All three surfaces reflect the same density & margins | P1 |

## 10. Font, Divider, Columns, Accent, Reset (TC-069–075)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-069 | Fresh resume | Settings → Font = **Serif** | Body/headings switch to serif in all surfaces | P2 |
| TC-070 | Font = Serif | Switch to **Sans** | Reverts to sans-serif | P2 |
| TC-071 | ATS Classic (plain) | Settings → Section divider ON | Underline rule appears under section headings | P2 |
| TC-072 | Divider ON | Toggle divider OFF | Headings become plain again | P2 |
| TC-073 | Fresh resume | Settings → Accent color = custom hex | Accent applies to accent elements (headings/links/sidebar) consistently | P2 |
| TC-074 | Columns control | Settings → Columns = sidebar-left / right | Layout switches accordingly; content re-flows | P2 |
| TC-075 | Styles customized | Click **Reset all styling** | All style overrides clear; resume returns to template + defaults (wide margins, condensed education) | P1 |

## 11. PDF Export (TC-076–080)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-076 | Complete resume | Download PDF | A valid PDF downloads and opens without corruption | P1 |
| TC-077 | PDF open | Select text in the PDF | Text is selectable/searchable (not an image) | P1 |
| TC-078 | Multi-page resume | Add enough content for 2+ pages | Content paginates cleanly; no section straddles awkwardly / no clipped text | P1 |
| TC-079 | Styled resume | Change margins/spacing/condensed then export | PDF matches the Editable preview exactly | P1 |
| TC-080 | Special chars/emoji in data | Export PDF | Characters render or degrade gracefully (no crash, no garbage) | P2 |

## 12. DOCX Export (TC-081–085)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-081 | Complete resume | Download DOCX | Valid .docx opens in Word/Google Docs without repair prompts | P1 |
| TC-082 | DOCX open | Inspect structure | Single-column (or chosen layout) with real headings, not text boxes | P1 |
| TC-083 | Condensed education | Export DOCX | Education renders as the one-line format matching preview | P1 |
| TC-084 | Margins/spacing changed | Export DOCX | Page margins & spacing reflect settings | P2 |
| TC-085 | Sidebar template | Export DOCX | Two-column renders via table; content readable and ordered | P2 |

## 13. Preview Parity & Surfaces (TC-086–089)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-086 | Complete resume | Compare Editable vs PDF vs DOCX | Layout, order, and content match across all three | P1 |
| TC-087 | Preview toolbar | Switch Editable → PDF → DOCX tabs | Each surface renders the current data without stale content | P2 |
| TC-088 | Preview | Use zoom in/out control | Preview scales; content stays intact and centered | P3 |
| TC-089 | Preview | Use Print | Print view matches the resume (no app chrome/toolbars) | P2 |

## 14. ATS-Friendliness (TC-090–094)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-090 | ATS Classic | Export PDF, run through a text extractor | Name, contact, and all section text extract in correct reading order | P1 |
| TC-091 | ATS Classic | Inspect headings | Standard section headings present (Experience, Education, Skills, etc.) | P1 |
| TC-092 | ATS template | Check contact info placement | Contact details are in the body, not in a header/footer region | P1 |
| TC-093 | ATS template | Verify no critical info is image-only | No skill/contact conveyed only by icons/graphics | P2 |
| TC-094 | Single-column ATS template | Extract text | No column-mixing; sidebar templates flagged as less ATS-safe | P2 |

## 15. Edge Cases & Data Integrity (TC-095–100)

| ID | Preconditions | Steps | Expected result | Pri |
|---|---|---|---|---|
| TC-095 | Empty resume | Only a name, no sections | Renders name/header only; no empty section headings; export still valid | P2 |
| TC-096 | Autosave | Enter data, reload the page | Data restores from local storage (guided) | P1 |
| TC-097 | Cloud save | Signed in, save resume | Saves to cloud; 1-resume limit enforced with a clear message | P2 |
| TC-098 | Very long single field | 500-char institution/role | No overflow off-page; wraps or truncates gracefully | P3 |
| TC-099 | HTML/script-like input | Enter `<b>x</b>` / `"; DROP` in a field | Rendered as literal text (escaped), no markup injection or crash | P1 |
| TC-100 | Rapid edits | Type quickly across fields, switch template, toggle settings | No lost input, no stale render, no crash; final output reflects last state | P2 |
