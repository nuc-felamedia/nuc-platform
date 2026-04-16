import { PrismaClient } from '@prisma/client'
import * as fs from 'fs'
import slugify from 'slugify'

const prisma = new PrismaClient()

function makeSlug(name: string): string {
  return slugify(name, { lower: true, strict: true }).slice(0, 80)
}

function cleanName(name: string): string {
  return name.replace(/\.$/, '').replace(/,\s*$/, '').trim()
}

function extractState(name: string): string {
  const pairs: [string, string][] = [
    ['Lagos', 'Lagos'], ['Abuja', 'Abuja'], ['FCT', 'Abuja'],
    ['Gwagwalada', 'Abuja'], ['Kano', 'Kano'], ['Wudil', 'Kano'],
    ['Kaduna', 'Kaduna'], ['Zaria', 'Kaduna'], ['Ibadan', 'Oyo'],
    ['Ogbomoso', 'Oyo'], ['Oyo', 'Oyo'], ['Port Harcourt', 'Rivers'],
    ['Rivers', 'Rivers'], ['Uyo', 'Akwa Ibom'], ['Akwa Ibom', 'Akwa Ibom'],
    ['Nsukka', 'Enugu'], ['Abakaliki', 'Ebonyi'], ['Awka', 'Anambra'],
    ['Uli', 'Anambra'], ['Okija', 'Anambra'], ['Abeokuta', 'Ogun'],
    ['Ilishan', 'Ogun'], ['Iwo', 'Osun'], ['Ile-Ife', 'Osun'],
    ['Akure', 'Ondo'], ['Akungba', 'Ondo'], ['Ado-Ekiti', 'Ekiti'],
    ['Oye-Ekiti', 'Ekiti'], ['Makurdi', 'Benue'], ['Otukpo', 'Benue'],
    ['Jos', 'Plateau'], ['Pankshin', 'Plateau'], ['Minna', 'Niger'],
    ['Lapai', 'Niger'], ['Ilorin', 'Kwara'], ['Anyigba', 'Kogi'],
    ['Lokoja', 'Kogi'], ['Abraka', 'Delta'], ['Effurun', 'Delta'],
    ['Ibusa', 'Delta'], ['Ekpoma', 'Edo'], ['Okada', 'Edo'],
    ['Uturu', 'Abia'], ['Umudike', 'Abia'], ['Owerri', 'Imo'],
    ['Calabar', 'Cross River'], ['Gadau', 'Bauchi'], ['Azare', 'Bauchi'],
    ['Kashere', 'Gombe'], ['Yola', 'Adamawa'], ['Mubi', 'Adamawa'],
    ['Maiduguri', 'Borno'], ['Biu', 'Borno'], ['Damaturu', 'Yobe'],
    ['Gashua', 'Yobe'], ['Dutse', 'Jigawa'], ['Babura', 'Jigawa'],
    ['Dutsin-Ma', 'Katsina'], ['Daura', 'Katsina'], ['Birnin Kebbi', 'Kebbi'],
    ['Zuru', 'Kebbi'], ['Gusau', 'Zamfara'], ['Lafia', 'Nasarawa'],
    ['Wukari', 'Taraba'], ['Otuoke', 'Bayelsa'], ['Ndufu-Alike', 'Ebonyi'],
    ['Uburu', 'Ebonyi'], ['Enugu', 'Enugu'], ['Anambra', 'Anambra'],
    ['Ogun', 'Ogun'], ['Osun', 'Osun'], ['Ondo', 'Ondo'],
    ['Ekiti', 'Ekiti'], ['Benue', 'Benue'], ['Plateau', 'Plateau'],
    ['Niger', 'Niger'], ['Kwara', 'Kwara'], ['Kogi', 'Kogi'],
    ['Delta', 'Delta'], ['Edo', 'Edo'], ['Abia', 'Abia'],
    ['Imo', 'Imo'], ['Cross River', 'Cross River'], ['Bauchi', 'Bauchi'],
    ['Gombe', 'Gombe'], ['Adamawa', 'Adamawa'], ['Borno', 'Borno'],
    ['Yobe', 'Yobe'], ['Jigawa', 'Jigawa'], ['Katsina', 'Katsina'],
    ['Kebbi', 'Kebbi'], ['Sokoto', 'Sokoto'], ['Zamfara', 'Zamfara'],
    ['Nasarawa', 'Nasarawa'], ['Taraba', 'Taraba'], ['Bayelsa', 'Bayelsa'],
    ['Ebonyi', 'Ebonyi'],
  ]
  const lower = name.toLowerCase()
  for (const [keyword, state] of pairs) {
    if (lower.includes(keyword.toLowerCase())) return state
  }
  return 'Nigeria'
}

function parseCSV(content: string): string[][] {
  const rows: string[][] = []
  const lines = content.split('\n').filter((l: string) => l.trim())
  for (const line of lines) {
    const cols: string[] = []
    let inQuote = false
    let current = ''
    for (let i = 0; i < line.length; i++) {
      const ch = line[i]
      if (ch === '"') { inQuote = !inQuote }
      else if (ch === ',' && !inQuote) { cols.push(current.trim()); current = '' }
      else { current += ch }
    }
    cols.push(current.trim())
    rows.push(cols)
  }
  return rows
}

async function importUniversities() {
  console.log('🌍 Starting NUC university import...\n')
  const files = [
    { path: '/Users/sainteni/Downloads/2-federaluni.xlsx-2026-02-25.csv', type: 'FEDERAL' },
    { path: '/Users/sainteni/Downloads/4-stateuni.xlsx-2026-02-25.csv', type: 'STATE' },
    { path: '/Users/sainteni/Downloads/3-Privateuni.xlsx-2026-02-25.csv', type: 'PRIVATE' },
    { path: '/Users/sainteni/Downloads/6-TNE-Universities.xlsx-2026-02-25.csv', type: 'TRANSNATIONAL' },
  ]
  let created = 0, updated = 0, errors = 0
  const slugsSeen = new Set<string>()
  for (const file of files) {
    if (!fs.existsSync(file.path)) { console.log(`⚠️  Not found: ${file.path}`); continue }
    const content = fs.readFileSync(file.path, 'utf-8')
    const rows = parseCSV(content)
    console.log(`📂 ${file.type}: ${rows.length - 1} universities`)
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (!row[1] || row[1].trim().length < 3) continue
      const name = cleanName(row[1])
      if (!name) continue
      let slug = makeSlug(name)
      let counter = 1
      while (slugsSeen.has(slug)) { slug = `${makeSlug(name)}-${counter++}` }
      slugsSeen.add(slug)
      const yearRaw = parseInt(row[4] || row[3] || '0')
      const year = yearRaw > 1900 && yearRaw < 2030 ? yearRaw : null
      const websiteRaw = (row[3] || '').trim().replace(/^"|"$/g, '').trim()
      const website = websiteRaw.startsWith('http') ? websiteRaw : websiteRaw ? `https://${websiteRaw}` : null
      const vc = (row[2] || '').trim() || null
      try {
        const existing = await prisma.university.findFirst({ where: { name: { equals: name, mode: 'insensitive' } } })
        if (existing) {
          await prisma.university.update({ where: { id: existing.id }, data: { type: file.type as any, vcName: vc || existing.vcName || undefined, website: website || existing.website || undefined, yearEstablished: year || existing.yearEstablished || undefined, state: extractState(name) } })
          updated++
        } else {
          await prisma.university.create({ data: { name, slug, type: file.type as any, state: extractState(name), vcName: vc || undefined, website: website || undefined, yearEstablished: year || undefined, isActive: true } })
          created++
        }
      } catch (e: any) {
        errors++
        if (errors <= 5) console.error(`  ✗ ${name}: ${e.message}`)
      }
    }
  }
  const [total, fed, st, priv] = await Promise.all([
    prisma.university.count({ where: { isActive: true } }),
    prisma.university.count({ where: { isActive: true, type: 'FEDERAL' } }),
    prisma.university.count({ where: { isActive: true, type: 'STATE' } }),
    prisma.university.count({ where: { isActive: true, type: 'PRIVATE' } }),
  ])
  await prisma.platformStat.upsert({ where: { id: 'singleton' }, update: { totalUniversities: total, federalCount: fed, stateCount: st, privateCount: priv }, create: { id: 'singleton', totalUniversities: total, federalCount: fed, stateCount: st, privateCount: priv, totalPrograms: 5000, accreditedPrograms: 3800, pendingPrograms: 600 } })
  console.log(`\n✅ Done! Created: ${created} | Updated: ${updated} | Errors: ${errors}`)
  console.log(`📊 Total: ${total} | Federal: ${fed} | State: ${st} | Private: ${priv}`)
}

importUniversities().catch(console.error).finally(() => prisma.$disconnect())
