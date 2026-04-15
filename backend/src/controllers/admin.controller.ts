// src/controllers/admin.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse } from '../utils/response'

export async function getDashboard(req: Request, res: Response) {
  const [
    totalUsers,
    totalUniversities,
    totalPrograms,
    totalAccreditations,
    recentUsers,
    recentPosts,
    accByStatus,
    uniByType,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.university.count({ where: { isActive: true } }),
    prisma.program.count({ where: { isActive: true } }),
    prisma.accreditation.count({ where: { isCurrent: true } }),
    prisma.user.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, email: true, firstName: true, lastName: true, role: true, createdAt: true } }),
    prisma.post.findMany({ take: 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, type: true, status: true, createdAt: true } }),
    prisma.accreditation.groupBy({ by: ['status'], where: { isCurrent: true }, _count: { status: true } }),
    prisma.university.groupBy({ by: ['type'], where: { isActive: true }, _count: { type: true } }),
  ])

  return successResponse(res, {
    summary: { totalUsers, totalUniversities, totalPrograms, totalAccreditations },
    recentUsers,
    recentPosts,
    accreditationByStatus: accByStatus.map((a) => ({ status: a.status, count: a._count.status })),
    universitiesByType: uniByType.map((u) => ({ type: u.type, count: u._count.type })),
  })
}

export async function getUsers(req: Request, res: Response) {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isActive: true, isVerified: true, lastLogin: true, createdAt: true },
  })
  return successResponse(res, users)
}

export async function updateUserRole(req: Request, res: Response) {
  const { role } = req.body
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role },
    select: { id: true, email: true, role: true },
  })
  return successResponse(res, user, 'User role updated')
}

export async function toggleUserActive(req: Request, res: Response) {
  const user = await prisma.user.findUnique({ where: { id: req.params.id } })
  const updated = await prisma.user.update({
    where: { id: req.params.id },
    data: { isActive: !user?.isActive },
    select: { id: true, email: true, isActive: true },
  })
  return successResponse(res, updated, `User ${updated.isActive ? 'activated' : 'deactivated'}`)
}
