// src/controllers/directorate.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse } from '../utils/response'
import slugify from 'slugify'

function slug(t: string) { return slugify(t, { lower: true, strict: true }) }

export async function getDirectorates(req: Request, res: Response) {
  const directorates = await prisma.directorate.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      divisions: {
        orderBy: { order: 'asc' },
        include: { staff: { orderBy: { order: 'asc' } } },
      },
    },
  })
  return successResponse(res, directorates)
}

export async function getDirectorate(req: Request, res: Response) {
  const d = await prisma.directorate.findUnique({
    where: { slug: req.params.slug },
    include: {
      divisions: {
        orderBy: { order: 'asc' },
        include: { staff: { orderBy: { order: 'asc' } } },
      },
    },
  })
  if (!d) return errorResponse(res, 'Directorate not found', 404)
  return successResponse(res, d)
}

export async function createDirectorate(req: Request, res: Response) {
  const { name, ...rest } = req.body
  const d = await prisma.directorate.create({ data: { name, slug: slug(name), ...rest } })
  return successResponse(res, d, 'Directorate created', 201)
}

export async function updateDirectorate(req: Request, res: Response) {
  const d = await prisma.directorate.update({ where: { id: req.params.id }, data: req.body })
  return successResponse(res, d, 'Directorate updated')
}
