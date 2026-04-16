// src/server.ts
import 'express-async-errors'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import compression from 'compression'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

import { errorHandler } from './middleware/errorHandler'
import { notFound } from './middleware/notFound'
import { logger } from './utils/logger'

// Routes
import authRoutes from './routes/auth.routes'
import universityRoutes from './routes/university.routes'
import programRoutes from './routes/program.routes'
import accreditationRoutes from './routes/accreditation.routes'
import directorateRoutes from './routes/directorate.routes'
import postRoutes from './routes/post.routes'
import documentRoutes from './routes/document.routes'
import statsRoutes from './routes/stats.routes'
import searchRoutes from './routes/search.routes'
import adminRoutes from './routes/admin.routes'
import apiKeyRoutes from './routes/apiKey.routes'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// ── Security ──
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))

// ── Rate limiting ──
const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: Number(process.env.RATE_LIMIT_MAX) || 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// ── Middleware ──
app.set("trust proxy", 1)
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
app.set("trust proxy", 1)
app.use(morgan('combined', { stream: { write: (msg) => logger.http(msg.trim()) } }))

// ── Health check ──
app.get('/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV })
})

// ── API Routes ──
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/universities', universityRoutes)
app.use('/api/v1/programs', programRoutes)
app.use('/api/v1/accreditation', accreditationRoutes)
app.use('/api/v1/directorates', directorateRoutes)
app.use('/api/v1/posts', postRoutes)
app.use('/api/v1/documents', documentRoutes)
app.use('/api/v1/stats', statsRoutes)
app.use('/api/v1/search', searchRoutes)
app.use('/api/v1/admin', adminRoutes)
app.use('/api/v1/api-keys', apiKeyRoutes)

// ── Error Handling ──
app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => {
  logger.info(`🚀 NUC Platform API running on port ${PORT} [${process.env.NODE_ENV}]`)
})

export default app

async function runSeed() {
  const { PrismaClient } = require('@prisma/client')
  const bcrypt = require('bcryptjs')
  const db = new PrismaClient()
  try {
    const count = await db.university.count()
    if (count > 0) { await db.$disconnect(); return }
    console.log('🌱 Running seed...')
    const hash = await bcrypt.hash('NucAdmin2024!', 12)
    await db.user.upsert({ where: { email: 'admin@nuc.edu.ng' }, update: {}, create: { email: 'admin@nuc.edu.ng', password: hash, firstName: 'NUC', lastName: 'Admin', role: 'SUPER_ADMIN', isVerified: true } })
    const unis = [
      { name: 'University of Lagos', slug: 'unilag', type: 'FEDERAL', state: 'Lagos', yearEstablished: 1962, abbreviation: 'UNILAG', description: 'Top federal university in Nigeria' },
      { name: 'University of Ibadan', slug: 'ui', type: 'FEDERAL', state: 'Oyo', yearEstablished: 1948, abbreviation: 'UI', description: 'Premier university in Nigeria' },
      { name: 'Ahmadu Bello University', slug: 'abu', type: 'FEDERAL', state: 'Kaduna', yearEstablished: 1962, abbreviation: 'ABU', description: 'Largest university in Nigeria' },
      { name: 'University of Nigeria Nsukka', slug: 'unn', type: 'FEDERAL', state: 'Enugu', yearEstablished: 1960, abbreviation: 'UNN', description: 'First indigenous university' },
      { name: 'Obafemi Awolowo University', slug: 'oau', type: 'FEDERAL', state: 'Osun', yearEstablished: 1961, abbreviation: 'OAU', description: 'Leading federal university' },
      { name: 'Lagos State University', slug: 'lasu', type: 'STATE', state: 'Lagos', yearEstablished: 1983, abbreviation: 'LASU', description: 'Leading state university' },
      { name: 'Covenant University', slug: 'covenant', type: 'PRIVATE', state: 'Ogun', yearEstablished: 2002, abbreviation: 'CU', description: 'Top private university' },
      { name: 'Pan-Atlantic University', slug: 'pau', type: 'PRIVATE', state: 'Lagos', yearEstablished: 2002, abbreviation: 'PAU', description: 'Home of Lagos Business School' },
    ]
    for (const u of unis) {
      await db.university.upsert({ where: { slug: u.slug }, update: {}, create: u })
    }
    await db.platformStat.upsert({ where: { id: 'singleton' }, update: { totalUniversities: 241, federalCount: 74, stateCount: 67, privateCount: 100 }, create: { id: 'singleton', totalUniversities: 241, federalCount: 74, stateCount: 67, privateCount: 100, totalPrograms: 5000, accreditedPrograms: 3800, pendingPrograms: 600 } })
    console.log('✅ Seed complete!')
    await db.$disconnect()
  } catch(e) { console.error('Seed error:', e); await db.$disconnect() }
}
if (process.env.NODE_ENV !== 'production') {
  runSeed()
}
