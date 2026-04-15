// src/routes/program.routes.ts
import { Router } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse } from '../utils/response'
import { authenticate, requireRole } from '../middleware/auth'
import slugify from 'slugify'

const router = Router()

router.get('/', async (req, res) => {
  const where: any = { isActive: true }
  if (req.query.universityId) where.universityId = req.query.universityId
  if (req.query.facultyId) where.facultyId = req.query.facultyId
  if (req.query.q) where.name = { contains: req.query.q as string, mode: 'insensitive' }
  const programs = await prisma.program.findMany({
    where, orderBy: { name: 'asc' },
    include: {
      university: { select: { name: true, slug: true } },
      faculty: { select: { name: true } },
      accreditations: { where: { isCurrent: true }, select: { status: true, year: true, expiryDate: true } },
    },
  })
  return successResponse(res, programs)
})

router.get('/:id', async (req, res) => {
  const program = await prisma.program.findUnique({
    where: { id: req.params.id },
    include: {
      university: true,
      faculty: true,
      accreditations: { orderBy: { year: 'desc' } },
    },
  })
  if (!program) return errorResponse(res, 'Program not found', 404)
  return successResponse(res, program)
})

router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), async (req, res) => {
  const { name, universityId, ...rest } = req.body
  const s = slugify(`${name}-${universityId}`, { lower: true, strict: true })
  const program = await prisma.program.create({ data: { name, slug: s, universityId, ...rest } })
  return successResponse(res, program, 'Program created', 201)
})

router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), async (req, res) => {
  const program = await prisma.program.update({ where: { id: req.params.id }, data: req.body })
  return successResponse(res, program, 'Program updated')
})

export default router
