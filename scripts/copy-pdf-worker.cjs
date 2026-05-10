const fs = require("fs")
const path = require("path")

const dest = path.join(__dirname, "..", "public", "pdf.worker.min.mjs")
const candidates = [
  path.join(__dirname, "..", "node_modules", "react-pdf", "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
  path.join(__dirname, "..", "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs"),
]

const src = candidates.find((p) => fs.existsSync(p))
if (!src) {
  console.warn("copy-pdf-worker: pdf.worker.min.mjs not found (skip)")
  process.exit(0)
}

fs.mkdirSync(path.dirname(dest), { recursive: true })
fs.copyFileSync(src, dest)
