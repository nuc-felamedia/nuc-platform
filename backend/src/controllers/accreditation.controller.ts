// src/controllers/accreditation.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response'

export async function getAccreditations(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(100, Number(req.query.limit) || 20)
  const skip = (page - 1) * limit

  const where: any = { isCurrent: true }
  if (req.query.status) where.status = req.query.status
  if (req.query.year) where.year = Number(req.query.year)

  const programWhere: any = {}
  if (req.query.universityId) programWhere.universityId = req.query.universityId
  if (req.query.facultyId) programWhere.facultyId = req.query.facultyId
  if (req.query.q) {
    programWhere.OR = [
      { name: { contains: req.query.q as string, mode: 'insensitive' } },
      { university: { name: { contains: req.query.q as string, mode: 'insensitive' } } },
    ]
  }

  if (Object.keys(programWhere).length > 0) where.program = programWhere

  const [records, total] = await Promise.all([
    prisma.accreditation.findMany({
      where,
      skip,
      take: limit,
      orderBy: [{ program: { university: { name: 'asc' } } }, { program: { name: 'asc' } }],
      include: {
        program: {
          include: {
            university: { select: { id: true, name: true, slug: true, state: true, type: true } },
            faculty: { select: { name: true } },
          },
        },
      },
    }),
    prisma.accreditation.count({ where }),
  ])

  return paginatedResponse(res, records, total, page, limit)
}

export async function getAccreditation(req: Request, res: Response) {
  const record = await prisma.accreditation.findUnique({
    where: { id: req.params.id },
    include: {
      program: {
        include: {
          university: true,
          faculty: true,
          accreditations: { orderBy: { year: 'desc' } },
        },
      },
    },
  })
  if (!record) return errorResponse(res, 'Accreditation record not found', 404)
  return successResponse(res, record)
}

export async function createAccreditation(req: Request, res: Response) {
  const { programId, status, year, expiryDate, notes, visitDate } = req.body

  // Mark previous as not current
  await prisma.accreditation.updateMany({
    where: { programId, isCurrent: true },
    data: { isCurrent: false },
  })

  const record = await prisma.accreditation.create({
    data: { programId, status, year, expiryDate: expiryDate ? new Date(expiryDate) : null, notes, visitDate: visitDate ? new Date(visitDate) : null, isCurrent: true },
    include: { program: { include: { university: { select: { name: true } } } } },
  })

  return successResponse(res, record, 'Accreditation record created', 201)
}

export async function updateAccreditation(req: Request, res: Response) {
  const record = await prisma.accreditation.update({
    where: { id: req.params.id },
    data: req.body,
  })
  return successResponse(res, record, 'Accreditation updated')
}

export async function checkAccreditation(req: Request, res: Response) {
  const { universitySlug, programSlug } = req.query

  const program = await prisma.program.findFirst({
    where: {
      slug: programSlug as string,
      university: { slug: universitySlug as string },
    },
    include: {
      university: { select: { name: true, slug: true } },
      faculty: { select: { name: true } },
      accreditations: {
        where: { isCurrent: true },
        select: { status: true, year: true, expiryDate: true },
      },
    },
  })

  if (!program) return errorResponse(res, 'Program not found', 404)

  const current = program.accreditations[0]
  return successResponse(res, {
    university: program.university,
    program: { name: program.name, degreeType: program.degreeType },
    faculty: program.faculty,
    accreditation: current || null,
    isAccredited: current?.status === 'FULL',
  })
}
// ─────────────────────────────────────────────────────────────────────────────
// ADD THIS FUNCTION to the bottom of:
// backend/src/controllers/accreditation.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

export async function getProgramHistory(req: Request, res: Response) {
  try {
    const { programId } = req.params

    const program = await prisma.program.findUnique({
      where: { id: programId },
      include: {
        university: {
          select: { id: true, name: true, slug: true, type: true, state: true },
        },
        faculty: { select: { name: true } },
      },
    })

    if (!program) return errorResponse(res, 'Program not found', 404)

    const history = await prisma.accreditation.findMany({
      where: { programId },
      orderBy: { year: 'asc' },
      select: {
        id: true, status: true, year: true,
        expiryDate: true, isCurrent: true, notes: true,
      },
    })

    const related = await prisma.program.findMany({
      where: {
        universityId: program.universityId,
        isActive: true,
        id: { not: programId },
      },
      take: 6,
      select: {
        id: true, name: true, degreeType: true,
        accreditations: {
          where: { isCurrent: true },
          select: { status: true, year: true },
        },
      },
    })

    const stats = {
      total: history.length,
      full: history.filter(h => h.status === 'FULL').length,
      interim: history.filter(h => h.status === 'INTERIM').length,
      denied: history.filter(h => h.status === 'DENIED').length,
      firstYear: history[0]?.year ?? null,
      lastYear: history[history.length - 1]?.year ?? null,
    }

    return successResponse(res, { program, history, related, stats })
  } catch (error) {
    return errorResponse(res, 'Failed to fetch program history', 500)
  }
}
