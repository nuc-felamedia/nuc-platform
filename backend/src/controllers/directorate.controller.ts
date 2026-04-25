// REPLACE backend/src/controllers/directorate.controller.ts with this entire file

import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse, errorResponse, paginatedResponse } from '../utils/response'
import slugify from 'slugify'

function slug(t: string) { return slugify(t, { lower: true, strict: true }) }

// ── Public ────────────────────────────────────────────────────────────────────

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

export async function getDirectorate(req: Request, res: Response) {
  const d = await prisma.directorate.findUnique({
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
  if (!d) return errorResponse(res, 'Directorate not found', 404)
  return successResponse(res, d)
}

// ── Admin — Directorates ──────────────────────────────────────────────────────

export async function getAllDirectoratesAdmin(req: Request, res: Response) {
  const directorates = await prisma.directorate.findMany({
    orderBy: { order: 'asc' },
    include: {
      divisions: {
        orderBy: { order: 'asc' },
        include: {
          staff: { orderBy: { order: 'asc' } },
        },
      },
    },
  })
  return successResponse(res, directorates)
}

export async function createDirectorate(req: Request, res: Response) {
  const { name, mandate, directorName, directorTitle, directorEmail, order } = req.body
  if (!name) return errorResponse(res, 'Name is required', 400)
  const d = await prisma.directorate.create({
    data: {
      name,
      slug: slug(name),
      mandate: mandate || null,
      directorName: directorName || null,
      directorTitle: directorTitle || null,
      directorEmail: directorEmail || null,
      order: order || 0,
      isActive: true,
    },
  })
  return successResponse(res, d, 'Directorate created', 201)
}

export async function updateDirectorate(req: Request, res: Response) {
  const { name, mandate, directorName, directorTitle, directorEmail, order, isActive } = req.body
  const data: any = {}
  if (name !== undefined) { data.name = name; data.slug = slug(name) }
  if (mandate !== undefined) data.mandate = mandate
  if (directorName !== undefined) data.directorName = directorName
  if (directorTitle !== undefined) data.directorTitle = directorTitle
  if (directorEmail !== undefined) data.directorEmail = directorEmail
  if (order !== undefined) data.order = order
  if (isActive !== undefined) data.isActive = isActive
  const d = await prisma.directorate.update({ where: { id: req.params.id }, data })
  return successResponse(res, d, 'Directorate updated')
}

// ── Admin — Divisions ─────────────────────────────────────────────────────────

export async function createDivision(req: Request, res: Response) {
  const { name, description, directorateId, order } = req.body
  if (!name || !directorateId) return errorResponse(res, 'Name and directorateId are required', 400)
  const d = await prisma.division.create({
    data: {
      name,
      slug: slug(name),
      description: description || null,
      directorateId,
      order: order || 0,
    },
  })
  return successResponse(res, d, 'Division created', 201)
}

export async function updateDivision(req: Request, res: Response) {
  const { name, description, order } = req.body
  const data: any = {}
  if (name !== undefined) { data.name = name; data.slug = slug(name) }
  if (description !== undefined) data.description = description
  if (order !== undefined) data.order = order
  const d = await prisma.division.update({ where: { id: req.params.id }, data })
  return successResponse(res, d, 'Division updated')
}

export async function deleteDivision(req: Request, res: Response) {
  await prisma.division.delete({ where: { id: req.params.id } })
  return successResponse(res, null, 'Division deleted')
}

// ── Admin — Staff ─────────────────────────────────────────────────────────────

export async function getStaffInDivision(req: Request, res: Response) {
  const staff = await prisma.staff.findMany({
    where: { divisionId: req.params.divisionId },
    orderBy: { order: 'asc' },
  })
  return successResponse(res, staff)
}

export async function createStaff(req: Request, res: Response) {
  const { name, title, email, phone, bio, photoUrl, linkedin, divisionId, order, isPublic } = req.body
  if (!name || !divisionId) return errorResponse(res, 'Name and divisionId are required', 400)
  const staff = await prisma.staff.create({
    data: {
      name,
      title: title || null,
      email: email || null,
      phone: phone || null,
      bio: bio || null,
      photoUrl: photoUrl || null,
      linkedin: linkedin || null,
      divisionId,
      order: order || 0,
      isPublic: isPublic !== false,
    },
  })
  return successResponse(res, staff, 'Staff member created', 201)
}

export async function updateStaff(req: Request, res: Response) {
  const { name, title, email, phone, bio, photoUrl, linkedin, divisionId, order, isPublic } = req.body
  const staff = await prisma.staff.update({
    where: { id: req.params.id },
    data: {
      ...(name !== undefined && { name }),
      ...(title !== undefined && { title }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(bio !== undefined && { bio }),
      ...(photoUrl !== undefined && { photoUrl }),
      ...(linkedin !== undefined && { linkedin }),
      ...(divisionId !== undefined && { divisionId }),
      ...(order !== undefined && { order }),
      ...(isPublic !== undefined && { isPublic }),
    },
  })
  return successResponse(res, staff, 'Staff updated')
}

export async function deleteStaff(req: Request, res: Response) {
  await prisma.staff.delete({ where: { id: req.params.id } })
  return successResponse(res, null, 'Staff member removed')
}

// ── Staff self-profile ────────────────────────────────────────────────────────

export async function getMyStaffProfile(req: Request, res: Response) {
  const userId = (req as any).user?.userId
  const staff = await prisma.staff.findFirst({
    where: { userId },
    include: { division: { include: { directorate: true } } },
  })
  return successResponse(res, staff)
}

export async function upsertStaffProfile(req: Request, res: Response) {
  const userId = (req as any).user?.userId
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) return errorResponse(res, 'User not found', 404)
  const { divisionId, title, phone, bio, photoUrl, linkedin, isPublic } = req.body
  if (!divisionId) return errorResponse(res, 'Division is required', 400)
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
  const staff = existing
    ? await prisma.staff.update({ where: { id: existing.id }, data })
    : await prisma.staff.create({ data })
  return successResponse(res, staff, existing ? 'Profile updated' : 'Profile created', existing ? 200 : 201)
}
