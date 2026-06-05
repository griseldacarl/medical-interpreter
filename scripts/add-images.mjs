import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dataDir = path.resolve(__dirname, '../src/data')

const IMAGE_MAPPINGS = {
  // Skeletal
  'sk-001': 'Gray70.png',
  'sk-002': 'Gray187.png',
  'sk-003': 'Gray187.png',
  'sk-004': 'Gray176.png',
  'sk-005': 'Gray202.png',
  'sk-006': 'Gray205.png',
  'sk-007': 'Gray115.png',
  'sk-008': 'Gray123.png',
  'sk-009': 'Gray89.png',
  'sk-010': 'Gray 111 - Vertebral column-coloured.png',
  'sk-011': 'Gray235.png',
  'sk-012': 'Gray244.png',
  'sk-013': 'Gray258.png',
  'sk-014': 'Gray260.png',
  'sk-015': 'Gray259.png',
  'sk-016': 'Gray207.png',
  'sk-017': 'Gray213.png',
  'sk-018': 'Gray214.png',
  'sk-019': 'Gray222.png',
  'sk-020': 'Gray222.png',
  'sk-021': 'Gray222.png',
  'sk-022': 'Gray281.png',
  'sk-023': 'Gray291.png',
  'sk-024': 'Gray103.png',
  'sk-025': 'Gray102.png',
  'sk-026': 'Gray157.png',
  'sk-027': 'Gray164.png',
  'sk-028': 'Gray137.png',
  // Muscular
  'mu-001': 'Gray410.png',
  'mu-002': 'Gray410.png',
  'mu-003': 'Gray412.png',
  'mu-004': 'Gray432.png',
  'mu-005': 'Gray410.png',
  'mu-006': 'Gray409.png',
  'mu-007': 'Gray409.png',
  'mu-008': 'Gray412.png',
  'mu-009': 'Gray434.png',
  'mu-010': 'Gray433.png',
  'mu-011': 'Gray438.png',
  'mu-012': 'Gray438.png',
  'mu-013': 'Gray398.png',
  'mu-014': 'Gray398.png',
  'mu-015': 'Gray391.png',
  'mu-016': 'Gray378.png',
  'mu-017': 'Gray384.png',
  'mu-018': 'Gray437.png',
  'mu-019': 'Gray418.png',
  'mu-020': 'Gray414.png',
  'mu-021': 'Gray430.png',
  'mu-022': 'Gray432.png',
  'mu-023': 'Gray430.png',
  'mu-024': 'Gray406.png',
  // Cardiovascular
  'cv-001': 'Gray490.png',
  'cv-002': 'Gray458.png',
  'cv-003': 'Gray461.png',
  'cv-005': 'Gray505.png',
  'cv-006': 'Gray497.png',
  'cv-007': 'Gray503.png',
  'cv-008': 'Gray503.png',
  'cv-009': 'Gray490.png',
  'cv-011': 'Gray490.png',
  'cv-012': 'Gray490.png',
  'cv-013': 'Gray490.png',
  'cv-014': 'Gray457.png',
  'cv-016': 'Gray457.png',
  'cv-017': 'Gray457.png',
  'cv-024': 'Gray490.png',
  'cv-025': 'Gray490.png',
  'cv-026': 'Gray490.png',
  'cv-028': 'Gray490.png',
  // Nervous
  'nv-001': 'Gray720.png',
  'nv-002': 'Gray662.png',
  'nv-003': 'Gray626.png',
  'nv-004': 'Gray626.png',
  'nv-009': 'Gray720.png',
  'nv-010': 'Gray720.png',
  'nv-011': 'Gray720.png',
  'nv-012': 'Gray720.png',
  'nv-013': 'Gray720.png',
  'nv-014': 'Gray720.png',
  'nv-015': 'Gray720.png',
  'nv-016': 'Gray720.png',
  'nv-017': 'Gray193.png',
  'nv-020': 'Gray626.png',
  'nv-021': 'Gray626.png',
  'nv-022': 'Gray626.png',
  'nv-024': 'Gray720.png',
  'nv-025': 'Gray720.png',
  // Respiratory
  're-001': 'Gray972.png',
  're-002': 'Gray960.png',
  're-003': 'Gray963.png',
  're-004': 'Gray963.png',
  're-005': 'Gray973.png',
  're-006': 'Gray966.png',
  're-007': 'Gray994.png',
  're-008': 'Gray950.png',
  're-009': 'Gray994.png',
  're-010': 'Gray950.png',
  're-017': 'Gray966.png',
  're-018': 'Gray398.png',
  're-020': 'Gray972.png',
  // Digestive
  'di-001': 'Gray1050.png',
  'di-002': 'Gray1032.png',
  'di-003': 'Gray1058.png',
  'di-004': 'Gray1060.png',
  'di-005': 'Gray1087.png',
  'di-006': 'Gray1099.png',
  'di-007': 'Gray1095.png',
  'di-008': 'Gray1072.png',
  'di-009': 'Gray1056.png',
  'di-010': 'Gray1060.png',
  'di-011': 'Gray1077.png',
  'di-012': 'Gray1077.png',
  'di-013': 'Gray996.png',
  'di-014': 'Gray1014.png',
  'di-015': 'Gray997.png',
  'di-016': 'Gray1051.png',
  'di-017': 'Gray1058.png',
  'di-018': 'Gray1058.png',
  'di-019': 'Gray1056.png',
  'di-020': 'Gray1060.png',
  'di-021': 'Gray1056.png',
  'di-022': 'Gray1056.png',
  'di-027': 'Gray1056.png',
}

const DATA_FILES = [
  'skeletal.ts',
  'muscular.ts',
  'cardiovascular.ts',
  'nervous.ts',
  'respiratory.ts',
  'digestive.ts',
  'positions.ts',
]

let totalCount = 0

for (const filename of DATA_FILES) {
  const filePath = path.join(dataDir, filename)
  let content = fs.readFileSync(filePath, 'utf-8')
  let fileCount = 0

  for (const [id, imageFile] of Object.entries(IMAGE_MAPPINGS)) {
    if (!content.includes(`id: '${id}'`)) continue

    const afterId = content.slice(content.indexOf(`id: '${id}'`) + `id: '${id}'`.length)
    const closeMatch = afterId.match(/\n  },/)
    if (!closeMatch) continue

    const insertPos = content.indexOf(`id: '${id}'`) + `id: '${id}'`.length + closeMatch.index
    content = content.slice(0, insertPos) + `\n    imageFile: '${imageFile}',` + content.slice(insertPos)
    fileCount++
    totalCount++
  }

  fs.writeFileSync(filePath, content)
  if (fileCount > 0) {
    console.log(`${filename}: ${fileCount} entries updated`)
  }
}

console.log(`\nTotal: ${totalCount} entries received imageFile`)
