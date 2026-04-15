// src/routes/apiKey.routes.ts
import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse } from '../utils/response'
import { authenticate, AuthRequest } from '../middleware/auth'
import crypto from 'crypto'

const router = Router()
router.use(authenticate)

router.get('/', async (req: AuthRequest, res) => {
  const keys = await prisma.apiKey.findMany({
    where: { userId: req.user!.userId },
    select: { id: true, name: true, key: true, callsToday: true, totalCalls: true, lastUsed: true, isActive: true, createdAt: true },
  })
  return successResponse(res, keys)
})

router.post('/', async (req: AuthRequest, res) => {
  const { name } = req.body
  const existing = await prisma.apiKey.count({ where: { userId: req.user!.userId } })
  if (existing >= 5) return errorResponse(res, 'Maximum 5 API keys per account', 400)
  const key = `nuc_${crypto.randomBytes(32).toString('hex')}`
  const apiKey = await prisma.apiKey.create({
    data: { key, name, userId: req.user!.userId },
    select: { id: true, name: true, key: true, createdAt: true },
  })
  return successResponse(res, apiKey, 'API key created', 201)
})

router.delete('/:id', async (req: AuthRequest, res) => {
  await prisma.apiKey.deleteMany({ where: { id: req.params.id, userId: req.user!.userId } })
  return successResponse(res, null, 'API key deleted')
})

export default router
