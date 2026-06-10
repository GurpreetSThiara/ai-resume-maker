const fs = require("fs")
const path = require("path")

const ROOT = "D:/nextjs/resume_builder_next"
const SCAN = ["lib", "components", "app", "hooks", "utils", "constants", "types", "config"]

function walk(dir, acc) {
  if (!fs.existsSync(dir)) return acc
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (["node_modules", ".next", ".git", "scratch"].includes(e.name)) continue
    const p = path.join(dir, e.name)
    if (e.isDirectory()) walk(p, acc)
    else if (/\.(ts|tsx)$/.test(e.name)) acc.push(p)
  }
  return acc
}

const files = []
for (const d of SCAN) walk(path.join(ROOT, d), files)

const touched = []
const re = /(["'])pdf-lib\1/g
for (const f of files) {
  const s = fs.readFileSync(f, "utf8")
  re.lastIndex = 0
  if (!re.test(s)) continue
  re.lastIndex = 0
  const out = s.replace(re, (_m, q) => `${q}@pdfme/pdf-lib${q}`)
  if (out !== s) {
    fs.writeFileSync(f, out)
    touched.push(path.relative(ROOT, f))
  }
}
console.log("Files updated:", touched.length)
touched.forEach((t) => console.log("  " + t))
