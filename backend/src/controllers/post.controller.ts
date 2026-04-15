// src/controllers/post.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response'
import slugify from 'slugify'

function slug(t: string) { return slugify(t, { lower: true, strict: true }) }

export async function getPosts(req: Request, res: Response) {
  const page = Math.max(1, Number(req.query.page) || 1)
  const limit = Math.min(50, Number(req.query.limit) || 12)
  const skip = (page - 1) * limit
  const where: any = { status: 'PUBLISHED' }
  if (req.query.type) where.type = req.query.type
  if (req.query.q) where.title = { contains: req.query.q as string, mode: 'insensitive' }

  const [posts, total] = await Promise.all([
    prisma.post.findMany({
      where, skip, take: limit,
      orderBy: { publishedAt: 'desc' },
      select: { id: true, title: true, slug: true, excerpt: true, type: true, featuredImage: true, publishedAt: true, authorName: true, viewCount: true, tags: true },
    }),
    prisma.post.count({ where }),
  ])
  return paginatedResponse(res, posts, total, page, limit)
}

export async function getPost(req: Request, res: Response) {
  const post = await prisma.post.findUnique({ where: { slug: req.params.slug } })
  if (!post || post.status !== 'PUBLISHED') return errorResponse(res, 'Post not found', 404)
  await prisma.post.update({ where: { id: post.id }, data: { viewCount: { increment: 1 } } })
  return successResponse(res, post)
}

export async function createPost(req: Request, res: Response) {
  const { title, ...rest } = req.body
  const post = await prisma.post.create({
    data: { title, slug: slug(title), ...rest, publishedAt: rest.status === 'PUBLISHED' ? new Date() : null },
  })
  return successResponse(res, post, 'Post created', 201)
}

export async function updatePost(req: Request, res: Response) {
  const data: any = { ...req.body }
  if (data.status === 'PUBLISHED') {
    const existing = await prisma.post.findUnique({ where: { id: req.params.id } })
    if (existing?.status !== 'PUBLISHED') data.publishedAt = new Date()
  }
  const post = await prisma.post.update({ where: { id: req.params.id }, data })
  return successResponse(res, post, 'Post updated')
}

export async function deletePost(req: Request, res: Response) {
  await prisma.post.update({ where: { id: req.params.id }, data: { status: 'ARCHIVED' } })
  return successResponse(res, null, 'Post archived')
}
