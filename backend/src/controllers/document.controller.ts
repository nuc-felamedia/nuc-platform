// src/controllers/document.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response'
import slugify from 'slugify'

function slug(t: string) { return slugify(t, { lower: true, strict: true }) }

export async function getDocuments(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Number(req.query.limit) || 12)
  const skip = (page - 1) * limit
  const where: any = { isPublic: true }
  if (req.query.category) where.category = req.query.category
  if (req.query.year) where.year = Number(req.query.year)
  if (req.query.q) where.title = { contains: req.query.q as string, mode: 'insensitive' }

  const [documents, total] = await Promise.all([
    prisma.document.findMany({ where, skip, take: limit, orderBy: { createdAt: 'desc' } }),
    prisma.document.count({ where }),
  ])
  return paginatedResponse(res, documents, total, page, limit)
}

export async function getDocument(req: Request, res: Response) {
  const doc = await prisma.document.findUnique({ where: { slug: req.params.slug } })
  if (!doc) return errorResponse(res, 'Document not found', 404)
  await prisma.document.update({ where: { id: doc.id }, data: { downloadCount: { increment: 1 } } })
  return successResponse(res, doc)
}

export async function createDocument(req: Request, res: Response) {
  const { title, ...rest } = req.body
  const doc = await prisma.document.create({ data: { title, slug: slug(title), ...rest } })
  return successResponse(res, doc, 'Document created', 201)
}

export async function updateDocument(req: Request, res: Response) {
  const doc = await prisma.document.update({ where: { id: req.params.id }, data: req.body })
  return successResponse(res, doc, 'Document updated')
}

export async function deleteDocument(req: Request, res: Response) {
  await prisma.document.delete({ where: { id: req.params.id } })
  return successResponse(res, null, 'Document deleted')
}
