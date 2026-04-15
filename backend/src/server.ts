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
app.use(compression())
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
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
