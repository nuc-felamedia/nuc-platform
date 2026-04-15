// prisma/seed.ts
import { PrismaClient, UniversityType, AccreditationStatus, DegreeType, UserRole, PostType, PostStatus, DocumentCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'
import slugify from 'slugify'

const prisma = new PrismaClient()

function slug(text: string) {
  return slugify(text, { lower: true, strict: true })
}

async function main() {
  console.log('🌱 Seeding NUC Platform database...')

  // ── Super Admin ──
  const adminPass = await bcrypt.hash('NucAdmin2024!', 12)
  await prisma.user.upsert({
    where: { email: 'admin@nuc.edu.ng' },
    update: {},
    create: {
      email: 'admin@nuc.edu.ng',
      password: adminPass,
      firstName: 'NUC',
      lastName: 'Administrator',
      role: UserRole.SUPER_ADMIN,
      isVerified: true,
    },
  })

  // ── Faculties ──
  const faculties = [
    'Engineering', 'Medicine & Health Sciences', 'Law', 'Agriculture',
    'Sciences', 'Arts & Humanities', 'Social Sciences', 'Education',
    'Management Sciences', 'Environmental Sciences', 'Pharmacy',
    'Veterinary Medicine', 'Architecture', 'Technology',
  ]
  const facultyMap: Record<string, string> = {}
  for (const name of faculties) {
    const f = await prisma.faculty.upsert({
      where: { slug: slug(name) },
      update: {},
      create: { name, slug: slug(name) },
    })
    facultyMap[name] = f.id
  }

  // ── Universities ──
  const universities = [
    {
      name: 'University of Lagos',
      abbreviation: 'UNILAG',
      type: UniversityType.FEDERAL,
      state: 'Lagos',
      city: 'Lagos',
      website: 'https://unilag.edu.ng',
      yearEstablished: 1962,
      nucApprovalYear: 1962,
      vcName: 'Prof. Folasade Ogunsola',
      description: 'University of Lagos is a world-class institution of learning committed to research, scholarship and community service.',
      studentPop: '50,000+',
    },
    {
      name: 'University of Ibadan',
      abbreviation: 'UI',
      type: UniversityType.FEDERAL,
      state: 'Oyo',
      city: 'Ibadan',
      website: 'https://ui.edu.ng',
      yearEstablished: 1948,
      nucApprovalYear: 1948,
      vcName: 'Prof. Kayode Adebowale',
      description: 'The premier university in Nigeria, established in 1948 as a college of the University of London.',
      studentPop: '25,000+',
    },
    {
      name: 'Ahmadu Bello University',
      abbreviation: 'ABU',
      type: UniversityType.FEDERAL,
      state: 'Kaduna',
      city: 'Zaria',
      website: 'https://abu.edu.ng',
      yearEstablished: 1962,
      nucApprovalYear: 1962,
      vcName: 'Prof. Kabiru Bala',
      description: 'One of the largest universities in Africa, serving as a regional centre of excellence in research.',
      studentPop: '40,000+',
    },
    {
      name: 'University of Nigeria Nsukka',
      abbreviation: 'UNN',
      type: UniversityType.FEDERAL,
      state: 'Enugu',
      city: 'Nsukka',
      website: 'https://unn.edu.ng',
      yearEstablished: 1960,
      nucApprovalYear: 1960,
      vcName: 'Prof. Charles Igwe',
      description: 'The first indigenous and autonomous university in Nigeria, founded by Dr. Nnamdi Azikiwe.',
      studentPop: '30,000+',
    },
    {
      name: 'Obafemi Awolowo University',
      abbreviation: 'OAU',
      type: UniversityType.FEDERAL,
      state: 'Osun',
      city: 'Ile-Ife',
      website: 'https://oauife.edu.ng',
      yearEstablished: 1961,
      nucApprovalYear: 1961,
      vcName: 'Prof. Adebayo Simeon Bamire',
      description: 'A foremost university in West Africa known for academic excellence and beautiful campus.',
      studentPop: '35,000+',
    },
    {
      name: 'Lagos State University',
      abbreviation: 'LASU',
      type: UniversityType.STATE,
      state: 'Lagos',
      city: 'Ojo',
      website: 'https://lasu.edu.ng',
      yearEstablished: 1983,
      nucApprovalYear: 1983,
      vcName: 'Prof. Ibiyemi Olatunji-Bello',
      description: 'A leading state university in Nigeria committed to providing quality education.',
      studentPop: '40,000+',
    },
    {
      name: 'Covenant University',
      abbreviation: 'CU',
      type: UniversityType.PRIVATE,
      state: 'Ogun',
      city: 'Ota',
      website: 'https://covenantuniversity.edu.ng',
      yearEstablished: 2002,
      nucApprovalYear: 2002,
      vcName: 'Prof. Abiodun Adebayo',
      description: 'A private Christian mission university consistently ranked among the best in Africa.',
      studentPop: '12,000+',
    },
    {
      name: 'Pan-Atlantic University',
      abbreviation: 'PAU',
      type: UniversityType.PRIVATE,
      state: 'Lagos',
      city: 'Lekki',
      website: 'https://pau.edu.ng',
      yearEstablished: 2002,
      nucApprovalYear: 2002,
      vcName: 'Prof. Enase Okonedo',
      description: 'Associated with the University of Navarra, home of the acclaimed Lagos Business School.',
      studentPop: '3,200+',
      campusSize: '75 hectares',
    },
  ]

  const uniMap: Record<string, string> = {}
  for (const u of universities) {
    const uni = await prisma.university.upsert({
      where: { slug: slug(u.name) },
      update: {},
      create: { ...u, slug: slug(u.name) },
    })
    uniMap[u.abbreviation!] = uni.id
  }

  // ── Programs + Accreditations ──
  const programs = [
    // UNILAG
    { uniAbbr: 'UNILAG', name: 'Computer Science', faculty: 'Sciences', degree: DegreeType.BSC, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'UNILAG', name: 'Law', faculty: 'Law', degree: DegreeType.LLB, status: AccreditationStatus.FULL, year: 2022, expiryYear: 2027 },
    { uniAbbr: 'UNILAG', name: 'Medicine & Surgery', faculty: 'Medicine & Health Sciences', degree: DegreeType.MBBS, status: AccreditationStatus.FULL, year: 2024, expiryYear: 2029 },
    { uniAbbr: 'UNILAG', name: 'Electrical Engineering', faculty: 'Engineering', degree: DegreeType.BENG, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'UNILAG', name: 'Mass Communication', faculty: 'Arts & Humanities', degree: DegreeType.BSC, status: AccreditationStatus.INTERIM, year: 2022, expiryYear: 2025 },
    // UI
    { uniAbbr: 'UI', name: 'Medicine & Surgery', faculty: 'Medicine & Health Sciences', degree: DegreeType.MBBS, status: AccreditationStatus.FULL, year: 2024, expiryYear: 2029 },
    { uniAbbr: 'UI', name: 'Mechanical Engineering', faculty: 'Engineering', degree: DegreeType.BENG, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'UI', name: 'Agriculture', faculty: 'Agriculture', degree: DegreeType.BSC, status: AccreditationStatus.FULL, year: 2022, expiryYear: 2027 },
    { uniAbbr: 'UI', name: 'Law', faculty: 'Law', degree: DegreeType.LLB, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    // ABU
    { uniAbbr: 'ABU', name: 'Veterinary Medicine', faculty: 'Veterinary Medicine', degree: DegreeType.BSC, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'ABU', name: 'Agricultural Engineering', faculty: 'Engineering', degree: DegreeType.BENG, status: AccreditationStatus.FULL, year: 2022, expiryYear: 2027 },
    { uniAbbr: 'ABU', name: 'Computer Science', faculty: 'Sciences', degree: DegreeType.BSC, status: AccreditationStatus.INTERIM, year: 2021, expiryYear: 2024 },
    // UNN
    { uniAbbr: 'UNN', name: 'Law', faculty: 'Law', degree: DegreeType.LLB, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'UNN', name: 'Medicine & Surgery', faculty: 'Medicine & Health Sciences', degree: DegreeType.MBBS, status: AccreditationStatus.INTERIM, year: 2022, expiryYear: 2025 },
    { uniAbbr: 'UNN', name: 'Pharmacy', faculty: 'Pharmacy', degree: DegreeType.BPHARM, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    // PAU
    { uniAbbr: 'PAU', name: 'Business Administration', faculty: 'Management Sciences', degree: DegreeType.MBA, status: AccreditationStatus.FULL, year: 2024, expiryYear: 2029 },
    { uniAbbr: 'PAU', name: 'Computer Science', faculty: 'Sciences', degree: DegreeType.BSC, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'PAU', name: 'Mass Communication', faculty: 'Arts & Humanities', degree: DegreeType.BSC, status: AccreditationStatus.FULL, year: 2023, expiryYear: 2028 },
    { uniAbbr: 'PAU', name: 'Political Science', faculty: 'Social Sciences', degree: DegreeType.BSC, status: AccreditationStatus.DENIED, year: 2022, expiryYear: null },
  ]

  for (const p of programs) {
    const uniId = uniMap[p.uniAbbr]
    if (!uniId) continue
    const s = slug(`${p.name}-${p.uniAbbr}`)
    let prog = await prisma.program.findFirst({ where: { universityId: uniId, slug: s } })
    if (!prog) {
      prog = await prisma.program.create({
        data: {
          name: p.name,
          slug: s,
          universityId: uniId,
          facultyId: facultyMap[p.faculty] || null,
          degreeType: p.degree,
        },
      })
    }
    await prisma.accreditation.create({
      data: {
        programId: prog.id,
        status: p.status,
        year: p.year,
        expiryDate: p.expiryYear ? new Date(`${p.expiryYear}-12-31`) : null,
        isCurrent: true,
      },
    })
  }

  // ── Directorates ──
  const directorates = [
    { name: 'Academic Planning', mandate: 'Planning and coordination of academic programmes in Nigerian universities.', directorName: 'Prof. Adeyemi Okafor', order: 1 },
    { name: 'Quality Assurance', mandate: 'Ensures universities maintain standards of quality in teaching, research and administration.', directorName: 'Prof. Chioma Osei', order: 2 },
    { name: 'Research & Innovation', mandate: 'Promotes research activities and innovation capacity in universities.', directorName: 'Prof. Kabiru Suleiman', order: 3 },
    { name: 'Legal Services', mandate: 'Provides legal advisory services and handles all legal matters of the Commission.', directorName: 'Barr. Seun Adeyemi', order: 4 },
    { name: 'ICT & Digital Services', mandate: 'Manages ICT infrastructure, digital systems and data services of the Commission.', directorName: 'Dr. Lanre Ogundimu', order: 5 },
    { name: 'Finance & Accounts', mandate: 'Responsible for budgeting, financial management and accounting of Commission funds.', directorName: 'Mrs. Blessing Okonkwo', order: 6 },
  ]

  for (const d of directorates) {
    await prisma.directorate.upsert({
      where: { slug: slug(d.name) },
      update: {},
      create: { ...d, slug: slug(d.name) },
    })
  }

  // ── Stats ──
  await prisma.platformStat.upsert({
    where: { id: 'singleton' },
    update: {
      totalUniversities: 241,
      federalCount: 74,
      stateCount: 67,
      privateCount: 100,
      transnationalCount: 0,
      totalPrograms: 5000,
      accreditedPrograms: 3800,
      pendingPrograms: 600,
    },
    create: {
      id: 'singleton',
      totalUniversities: 241,
      federalCount: 74,
      stateCount: 67,
      privateCount: 100,
      transnationalCount: 0,
      totalPrograms: 5000,
      accreditedPrograms: 3800,
      pendingPrograms: 600,
    },
  })

  // ── Sample Posts ──
  const posts = [
    {
      title: 'NUC Releases 2024 Undergraduate Accreditation Results',
      slug: 'nuc-2024-undergraduate-accreditation-results',
      excerpt: 'The National Universities Commission has released the results of the 2024 undergraduate accreditation exercise.',
      content: 'The National Universities Commission (NUC) has officially released the results of the 2024 undergraduate accreditation exercise covering over 200 universities across Nigeria...',
      type: PostType.BULLETIN,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-03-15'),
      authorName: 'NUC Communications',
    },
    {
      title: 'NUC Reconstitutes Committee on Degree Mills',
      slug: 'nuc-reconstitutes-committee-degree-mills',
      excerpt: 'The Executive Secretary of the NUC has inaugurated the Reconstituted Committee on Degree Mills.',
      content: 'The Executive Secretary of the National Universities Commission (NUC), Professor Abdullahi Yusufu Ribadu, recently inaugurated the Reconstituted Committee on Degree Mills...',
      type: PostType.NEWS,
      status: PostStatus.PUBLISHED,
      publishedAt: new Date('2024-02-20'),
      authorName: 'NUC Directorate of Public Affairs',
    },
  ]

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: {},
      create: post,
    })
  }

  console.log('✅ Database seeded successfully!')
}

main()
  .catch((e) => { console.error('❌ Seed error:', e); process.exit(1) })
  .finally(() => prisma.$disconnect())
