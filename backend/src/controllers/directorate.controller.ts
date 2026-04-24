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
// ─────────────────────────────────────────────────────────────────────────────
// ADD these functions to backend/src/controllers/directorate.controller.ts
// ─────────────────────────────────────────────────────────────────────────────

// GET /api/v1/directorates — public listing with divisions and staff
export async function getDirectorates(req: Request, res: Response) {
  const directorates = await prisma.directorate.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    include: {
      divisions: {
        orderBy: { order: 'asc' },
        include: {
          staff: {
            where: { isPublic: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })
  return successResponse(res, directorates)
}

// GET /api/v1/directorates/:slug — single directorate
export async function getDirectorate(req: Request, res: Response) {
  const directorate = await prisma.directorate.findUnique({
    where: { slug: req.params.slug },
    include: {
      divisions: {
        orderBy: { order: 'asc' },
        include: {
          staff: {
            where: { isPublic: true },
            orderBy: { order: 'asc' },
          },
        },
      },
    },
  })
  if (!directorate) return errorResponse(res, 'Directorate not found', 404)
  return successResponse(res, directorate)
}

// GET /api/v1/staff/profile — get current user's staff profile
export async function getMyStaffProfile(req: Request, res: Response) {
  const userId = (req as any).user?.userId
  const staff = await prisma.staff.findFirst({
    where: { userId },
    include: {
      division: {
        include: { directorate: true },
      },
    },
  })
  return successResponse(res, staff)
}

// POST /api/v1/staff/profile — create or update staff profile
export async function upsertStaffProfile(req: Request, res: Response) {
  const userId = (req as any).user?.userId
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return errorResponse(res, 'User not found', 404)

  const { divisionId, title, phone, bio, photoUrl, linkedin, isPublic } = req.body

  if (!divisionId) return errorResponse(res, 'Division is required', 400)

  const division = await prisma.division.findUnique({ where: { id: divisionId } })
  if (!division) return errorResponse(res, 'Division not found', 404)

  const existing = await prisma.staff.findFirst({ where: { userId } })

  const data = {
    name: `${user.firstName} ${user.lastName}`.trim(),
    email: user.email,
    title: title || null,
    phone: phone || null,
    bio: bio || null,
    photoUrl: photoUrl || null,
    linkedin: linkedin || null,
    isPublic: isPublic !== false,
    divisionId,
    userId,
  }

  let staff
  if (existing) {
    staff = await prisma.staff.update({ where: { id: existing.id }, data })
  } else {
    staff = await prisma.staff.create({ data })
  }

  return successResponse(res, staff, existing ? 'Profile updated' : 'Profile created', existing ? 200 : 201)
}

// GET /api/v1/staff/divisions — get all divisions grouped by directorate for dropdown
export async function getDivisionsForProfile(req: Request, res: Response) {
  const directorates = await prisma.directorate.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
    select: {
      id: true,
      name: true,
      divisions: {
        orderBy: { order: 'asc' },
        select: { id: true, name: true, directorateId: true },
      },
    },
  })
  return successResponse(res, directorates)
}
