// src/controllers/search.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse } from '../utils/response'

export async function globalSearch(req: Request, res: Response) {
  const q = req.query.q as string
  if (!q || q.trim().length < 2) return errorResponse(res, 'Query must be at least 2 characters', 400)

  const term = q.trim()

  const [universities, programs, posts, directorates] = await Promise.all([
    prisma.university.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { abbreviation: { contains: term, mode: 'insensitive' } },
          { state: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 5,
      select: { id: true, name: true, slug: true, type: true, state: true, abbreviation: true },
    }),
    prisma.program.findMany({
      where: {
        isActive: true,
        name: { contains: term, mode: 'insensitive' },
      },
      take: 8,
      include: {
        university: { select: { name: true, slug: true } },
        faculty: { select: { name: true } },
        accreditations: { where: { isCurrent: true }, select: { status: true } },
      },
    }),
    prisma.post.findMany({
      where: {
        status: 'PUBLISHED',
        OR: [
          { title: { contains: term, mode: 'insensitive' } },
          { excerpt: { contains: term, mode: 'insensitive' } },
        ],
      },
      take: 3,
      select: { id: true, title: true, slug: true, type: true, publishedAt: true },
    }),
    prisma.directorate.findMany({
      where: {
        isActive: true,
        name: { contains: term, mode: 'insensitive' },
      },
      take: 3,
      select: { id: true, name: true, slug: true, directorName: true },
    }),
  ])

  return successResponse(res, { universities, programs, posts, directorates, query: term })
}

export async function statsSearch(req: Request, res: Response) {
  const stats = await prisma.platformStat.findFirst()
  return successResponse(res, stats)
}
