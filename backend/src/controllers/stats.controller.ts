// src/controllers/stats.controller.ts
import { Request, Response } from 'express'
import { prisma } from '../utils/prisma'
import { successResponse } from '../utils/response'

export async function getStats(req: Request, res: Response) {
  // Compute live from DB
  const [
    totalUniversities,
    federalCount,
    stateCount,
    privateCount,
    totalPrograms,
    accreditedPrograms,
    interimPrograms,
    deniedPrograms,
  ] = await Promise.all([
    prisma.university.count({ where: { isActive: true } }),
    prisma.university.count({ where: { isActive: true, type: 'FEDERAL' } }),
    prisma.university.count({ where: { isActive: true, type: 'STATE' } }),
    prisma.university.count({ where: { isActive: true, type: 'PRIVATE' } }),
    prisma.program.count({ where: { isActive: true } }),
    prisma.accreditation.count({ where: { isCurrent: true, status: 'FULL' } }),
    prisma.accreditation.count({ where: { isCurrent: true, status: 'INTERIM' } }),
    prisma.accreditation.count({ where: { isCurrent: true, status: 'DENIED' } }),
  ])

  return successResponse(res, {
    totalUniversities,
    federalCount,
    stateCount,
    privateCount,
    transnationalCount: totalUniversities - federalCount - stateCount - privateCount,
    totalPrograms,
    accreditedPrograms,
    interimPrograms,
    deniedPrograms,
    accreditationRate: totalPrograms > 0 ? Math.round((accreditedPrograms / totalPrograms) * 100) : 0,
  })
}
