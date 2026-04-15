// scripts/import-csv.ts
// Imports cleaned accreditation CSV into PostgreSQL
// Usage: npx ts-node scripts/import-csv.ts <file.csv>

import { PrismaClient, DegreeType, AccreditationStatus } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import readline from 'readline'
import slugify from 'slugify'

const prisma = new PrismaClient()

function slug(text: string) {
  return slugify(text, { lower: true, strict: true })
}

interface CsvRow {
  university: string
  faculty: string
  program: string
  degree_type: string
  status: string
  year: string
  expiry_year: string
}

async function parseCSV(filePath: string): Promise<CsvRow[]> {
  const rows: CsvRow[] = []
  const fileStream = fs.createReadStream(filePath)
  const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity })
  let headers: string[] = []
  let isFirst = true

  for await (const line of rl) {
    if (isFirst) {
      headers = line.split(',').map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'))
      isFirst = false
      continue
    }
    if (!line.trim()) continue
    const values = line.split(',').map((v) => v.trim().replace(/^"|"$/g, ''))
    const row: any = {}
    headers.forEach((h, i) => { row[h] = values[i] || '' })
    rows.push(row as CsvRow)
  }

  return rows
}

async function importData(filePath: string) {
  console.log(`\n🚀 Starting import from: ${filePath}`)
  const rows = await parseCSV(filePath)
  console.log(`   Found ${rows.length} rows to import`)

  let created = 0
  let skipped = 0
  let errors = 0

  // Cache maps
  const uniCache = new Map<string, string>()
  const facultyCache = new Map<string, string>()

  for (const row of rows) {
    try {
      // Get or create university
      const uniKey = row.university.trim()
      let uniId = uniCache.get(uniKey)
      if (!uniId) {
        let uni = await prisma.university.findFirst({
          where: { name: { contains: uniKey, mode: 'insensitive' } },
        })
        if (!uni) {
          uni = await prisma.university.create({
            data: {
              name: uniKey,
              slug: slug(uniKey),
              type: 'FEDERAL', // default, can be updated manually
              state: 'Unknown',
            },
          })
          console.log(`   + Created university: ${uniKey}`)
        }
        uniId = uni.id
        uniCache.set(uniKey, uniId)
      }

      // Get or create faculty
      let facultyId: string | null = null
      if (row.faculty.trim()) {
        const facKey = row.faculty.trim()
        facultyId = facultyCache.get(facKey) || null
        if (!facultyId) {
          let fac = await prisma.faculty.findFirst({
            where: { name: { contains: facKey, mode: 'insensitive' } },
          })
          if (!fac) {
            fac = await prisma.faculty.create({
              data: { name: facKey, slug: slug(facKey) },
            })
          }
          facultyId = fac.id
          facultyCache.set(facKey, facultyId)
        }
      }

      // Get or create program
      const progSlug = slug(`${row.program}-${uniId}`)
      let program = await prisma.program.findFirst({
        where: { universityId: uniId, slug: progSlug },
      })
      if (!program) {
        program = await prisma.program.create({
          data: {
            name: row.program.trim(),
            slug: progSlug,
            universityId: uniId,
            facultyId,
            degreeType: (row.degree_type as DegreeType) || DegreeType.BSC,
          },
        })
      }

      // Mark previous accreditations as not current
      await prisma.accreditation.updateMany({
        where: { programId: program.id, isCurrent: true },
        data: { isCurrent: false },
      })

      // Create accreditation record
      await prisma.accreditation.create({
        data: {
          programId: program.id,
          status: (row.status as AccreditationStatus) || AccreditationStatus.PENDING,
          year: parseInt(row.year) || new Date().getFullYear(),
          expiryDate: row.expiry_year ? new Date(`${row.expiry_year}-12-31`) : null,
          isCurrent: true,
        },
      })

      created++
      if (created % 100 === 0) console.log(`   ✓ Imported ${created} records...`)
    } catch (err: any) {
      errors++
      if (errors <= 5) console.error(`   ✗ Error on row (${row.university} / ${row.program}):`, err.message)
    }
  }

  console.log(`\n✅ Import complete!`)
  console.log(`   Created: ${created}`)
  console.log(`   Skipped: ${skipped}`)
  console.log(`   Errors:  ${errors}`)

  // Update stats
  const totalUnis = await prisma.university.count({ where: { isActive: true } })
  const totalProgs = await prisma.program.count({ where: { isActive: true } })
  console.log(`\n📊 Database now has ${totalUnis} universities and ${totalProgs} programs`)
}

const filePath = process.argv[2]
if (!filePath) {
  console.error('❌ Usage: npx ts-node scripts/import-csv.ts <file.csv>')
  process.exit(1)
}

importData(path.resolve(filePath))
  .catch(console.error)
  .finally(() => prisma.$disconnect())
