import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../src/data')
const imagesDir = path.resolve(__dirname, '../public/images')

const DATA_FILES = [
  'skeletal.ts', 'muscular.ts', 'cardiovascular.ts',
  'nervous.ts', 'respiratory.ts', 'digestive.ts', 'positions.ts',
]

const imageFiles = new Set()
for (const filename of DATA_FILES) {
  const content = fs.readFileSync(path.join(dataDir, filename), 'utf-8')
  const regex = /imageFile:\s*'([^']+)'/g
  let match
  while ((match = regex.exec(content)) !== null) imageFiles.add(match[1])
}

if (imageFiles.size === 0) {
  console.log('No imageFile entries found. Run add-images.mjs first.')
  process.exit(0)
}

fs.mkdirSync(imagesDir, { recursive: true })

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }

async function resolveUrl(filename) {
  const api = 'https://commons.wikimedia.org/w/api.php'
  const params = new URLSearchParams({
    action: 'query', titles: `File:${filename}`,
    prop: 'imageinfo', iiprop: 'url', format: 'json',
  })
  const resp = await fetch(`${api}?${params}`, {
    headers: { 'User-Agent': 'MedicalInterpreter/1.0' },
  })
  if (!resp.ok) return null
  const data = await resp.json()
  const pages = data.query.pages
  const pageId = Object.keys(pages)[0]
  if (pageId === '-1') return null
  return pages[pageId].imageinfo?.[0]?.url || null
}

async function downloadFromUrl(url, dest) {
  const resp = await fetch(url, {
    headers: { 'User-Agent': 'MedicalInterpreter/1.0' },
  })
  if (!resp.ok) return false
  const buf = Buffer.from(await resp.arrayBuffer())
  fs.writeFileSync(dest, buf)
  return true
}

let okCount = 0, existCount = 0, failCount = 0, notFoundCount = 0
const total = imageFiles.size

for (const filename of imageFiles) {
  const dest = path.join(imagesDir, filename)
  if (fs.existsSync(dest)) {
    console.log(` SKIP ${filename}`)
    existCount++
    continue
  }

  await sleep(3000)

  const url = await resolveUrl(filename)
  if (!url) {
    console.error(` MISS ${filename} (not on Wikimedia)`)
    notFoundCount++
    failCount++
    continue
  }

  const ok = await downloadFromUrl(url, dest)
  if (ok) {
    console.log(`  OK  ${filename}`)
    okCount++
  } else {
    console.error(` FAIL ${filename} (HTTP error)` )
    failCount++
  }
}

console.log(`\nDone: ${okCount} downloaded, ${existCount} skipped, ${notFoundCount} not-found, ${failCount - notFoundCount} HTTP errors (${total} unique)`)
