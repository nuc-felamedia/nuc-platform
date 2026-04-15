// src/controllers/university.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response'
import slugify from 'slugify'

function slug(text: string) {
  return slugify(text, { lower: true, strict: true })
}

export async function getUniversities(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Number(req.query.limit) || 20)
  const skip = (page - 1) * limit

  const where: any = { isActive: true }
  if (req.query.type) where.type = req.query.type
  if (req.query.state) where.state = req.query.state
  if (req.query.q) {
    where.OR = [
      { name: { contains: req.query.q as string, mode: 'insensitive' } },
      { abbreviation: { contains: req.query.q as string, mode: 'insensitive' } },
    ]
  }

  const [universities, total] = await Promise.all([
    prisma.university.findMany({
      where,
      skip,
      take: limit,
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { programs: true } },
        programs: {
          include: {
            accreditations: { where: { isCurrent: true }, select: { status: true } },
          },
        },
      },
    }),
    prisma.university.count({ where }),
  ])

  const data = universities.map((u) => {
    const allAcc = u.programs.flatMap((p) => p.accreditations)
    return {
      id: u.id,
      name: u.name,
      slug: u.slug,
      abbreviation: u.abbreviation,
      type: u.type,
      state: u.state,
      city: u.city,
      logoUrl: u.logoUrl,
      yearEstablished: u.yearEstablished,
      vcName: u.vcName,
      website: u.website,
      totalPrograms: u._count.programs,
      accreditationSummary: {
        full: allAcc.filter((a) => a.status === 'FULL').length,
        interim: allAcc.filter((a) => a.status === 'INTERIM').length,
        denied: allAcc.filter((a) => a.status === 'DENIED').length,
        pending: allAcc.filter((a) => a.status === 'PENDING').length,
      },
    }
  })

  return paginatedResponse(res, data, total, page, limit)
}

export async function getUniversity(req: Request, res: Response) {
  const university = await prisma.university.findUnique({
    where: { slug: req.params.slug },
    include: {
      programs: {
        include: {
          faculty: { select: { name: true } },
          accreditations: {
            where: { isCurrent: true },
            select: { status: true, year: true, expiryDate: true },
          },
        },
        orderBy: { name: 'asc' },
      },
    },
  })

  if (!university) return errorResponse(res, 'University not found', 404)
  return successResponse(res, university)
}

export async function createUniversity(req: Request, res: Response) {
  const { name, ...rest } = req.body
  const university = await prisma.university.create({
    data: { name, slug: slug(name), ...rest },
  })
  return successResponse(res, university, 'University created', 201)
}

export async function updateUniversity(req: Request, res: Response) {
  const university = await prisma.university.update({
    where: { id: req.params.id },
    data: req.body,
  })
  return successResponse(res, university, 'University updated')
}

export async function deleteUniversity(req: Request, res: Response) {
  await prisma.university.update({
    where: { id: req.params.id },
    data: { isActive: false },
  })
  return successResponse(res, null, 'University deactivated')
}

export async function getStates(req: Request, res: Response) {
  const states = await prisma.university.findMany({
    where: { isActive: true },
    select: { state: true },
    distinct: ['state'],
    orderBy: { state: 'asc' },
  })
  return successResponse(res, states.map((s) => s.state))
}
