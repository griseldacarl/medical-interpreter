import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const scriptDir = fileURLToPath(new URL('.', import.meta.url))
const projectRoot = path.resolve(scriptDir, '..')
const outputDir = path.resolve(projectRoot, 'src/data/emergency')

const CONTENT_FILE = path.resolve(projectRoot,
  'Emergency Medicine Oral Board Review Illustrated (Cambridge Medicine).content.txt')

const OCR_FIXES = [
  [/v\s+o(m[ei])ting/g, 'vo$1ting'],
  [/w\s+eak/g, 'weak'],
  [/t\s+rauma/g, 'trauma'],
  [/v\s+isual/g, 'visual'],
  [/v\s+aginal/g, 'vaginal'],
  [/t\s+oothache/g, 'toothache'],
  [/a\s+nd/g, 'and'],
  [/n\s+aus\s+ea/g, 'nausea'],
  [/d\s+iabetes/g, 'diabetes'],
  [/h\s+ypertension/g, 'hypertension'],
  [/s\s+eizure/g, 'seizure'],
  [/h\s+e[ae]dache/g, 'headache'],
  [/p\s+atient/g, 'patient'],
  [/c\s+ough/g, 'cough'],
  [/f\s+ever/g, 'fever'],
  [/b\s+reathing/g, 'breathing'],
  [/b\s+leading/g, 'bleeding'],
  [/b\s+leeding/g, 'bleeding'],
  [/\|/g, ''],
]

function clean(text) {
  let s = text.replace(/\s{2,}/g, ' ')
  for (const [pat, repl] of OCR_FIXES) {
    s = s.replace(pat, repl)
  }
  return s.trim()
}

const content = fs.readFileSync(CONTENT_FILE, 'utf8')
const norm = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

const casePattern = /casE\s+(\d+|[A-Z]):\s*([^\n]*)/g
const markers = []
let m
while ((m = casePattern.exec(norm)) !== null) {
  if (m[1].match(/^[A-Za-z]$/)) continue
  markers.push({ num: parseInt(m[1]), rawTitle: m[2].trim(), index: m.index })
}

function extractDiagnosis(text) {
  const diagMatch = text.match(/Critical actions\s*\n\s*a[.)]\s*(.+?)(?:\n|$)/i)
  if (diagMatch) return clean(diagMatch[1])
  const diagSection = text.match(/[A-Z][.]\s*Diagnosis[^a-z]*\n\s*(.+?)(?:\n|$)/)
  if (diagSection) return clean(diagSection[1])
  return ''
}

function extractPearls(text) {
  const markers = [
    /T[.]\s*Pearls\s*\n/i, /P[.]\s*Pearls\s*\n/i,
    /[A-Z][.]\s*Pearls\s*\n/i
  ]
  for (const pat of markers) {
    const match = text.match(pat)
    if (!match) continue
    const after = text.slice(match.index + match[0].length)
    const lines = after.split('\n')
    let pearlText = ''
    for (const line of lines) {
      const t = line.trim()
      if (!t || t.startsWith('----------------Page')) continue
      if (t.match(/^[A-Z][.]\s*(References|Refs)/i)) break
      if (t.match(/^[A-Z][.]\s/) && pearlText.length > 40) break
      if (t === '==' || t.startsWith('== ')) continue
      pearlText += ' ' + t
    }
    const result = clean(pearlText)
    if (result.length > 20) return result
  }
  return ''
}

function categorize(title, diagnosis) {
  const t = title.toLowerCase()
  const d = diagnosis.toLowerCase()
  const checks = [
    ['cardiac', ['chest pain', 'palpitations', 'cardiac arrest', 'syncope',
      'myocardial', 'aortic', 'arrhythmia', 'heart']],
    ['trauma', ['trauma', 'assault', 'stab', 'penetrating', 'burn',
      'pedestrian struck', 'fall']],
    ['toxicology', ['overdose', 'snake', 'poisoning', 'toxic', 'ingestion', 'opioid']],
    ['pediatric', ['infant', 'child', 'children', 'pediatric', 'newborn',
      'congenital', 'pyloric', 'kawasaki']],
    ['neurologic', ['altered mental', 'seizure', 'headache', 'weakness',
      'visual impairment', 'mental status', 'stroke', 'hemorrhage',
      'light-headedness', 'dizziness', 'syncope']],
    ['respiratory', ['cough', 'shortness of breath', 'respiratory', 'sore throat',
      'cyanosis', 'throat swelling']],
    ['gi-gu', ['abdominal', 'vomiting', 'diarrhea', 'hematochezia', 'flank',
      'rectal', 'inguinal', 'hernia', 'renal', 'colic']],
  ]
  for (const [cat, keywords] of checks) {
    if (keywords.some(k => t.includes(k) || d.includes(k))) return cat
  }
  return 'general'
}

const cases = []
for (let i = 0; i < markers.length; i++) {
  const mk = markers[i]
  const start = mk.index
  const end = (i + 1 < markers.length) ? markers[i + 1].index : norm.length
  const caseText = norm.slice(start, end)

  let title = clean(mk.rawTitle)
  const authorMatch = title.match(/^(.+?)\s*\((.+?)\)\s*$/)
  const author = authorMatch ? authorMatch[2].trim() : ''
  title = authorMatch ? authorMatch[1].trim() : title

  const diagnosis = extractDiagnosis(caseText)
  const pearls = extractPearls(caseText)
  const category = categorize(title, diagnosis)

  cases.push({
    caseNumber: mk.num,
    title: title.charAt(0).toUpperCase() + title.slice(1),
    author,
    category,
    diagnosis,
    pearls,
  })
}

fs.mkdirSync(outputDir, { recursive: true })
const outputPath = path.resolve(outputDir, 'extracted-cases.json')
fs.writeFileSync(outputPath, JSON.stringify(cases, null, 2))

console.log(`Extracted ${cases.length} cases`)

const withDx = cases.filter(c => c.diagnosis).length
const withPearls = cases.filter(c => c.pearls).length
console.log(`Diagnosis: ${withDx}/${cases.length}, Pearls: ${withPearls}/${cases.length}`)

const cats = {}
for (const c of cases) cats[c.category] = (cats[c.category] || 0) + 1
console.log('Categories:', JSON.stringify(cats))
