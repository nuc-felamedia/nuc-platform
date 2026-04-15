// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express'
import { verifyAccessToken } from '../utils/jwt'
import { prisma } from '../utils/prisma'
import { errorResponse } from '../utils/response'

export interface AuthRequest extends Request {
  user?: { userId: string; email: string; role: string }
}

export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (!token) return errorResponse(res, 'Authentication required', 401)
    const payload = verifyAccessToken(token)
    req.user = payload
    next()
  } catch {
    return errorResponse(res, 'Invalid or expired token', 401)
  }
}

export function requireRole(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) return errorResponse(res, 'Authentication required', 401)
    if (!roles.includes(req.user.role)) return errorResponse(res, 'Insufficient permissions', 403)
    next()
  }
}

export async function optionalAuth(req: AuthRequest, _res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null
    if (token) {
      const payload = verifyAccessToken(token)
      req.user = payload
    }
  } catch {}
  next()
}

export async function apiKeyAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers['x-api-key'] as string
  if (!apiKey) return errorResponse(res, 'API key required', 401)
  const key = await prisma.apiKey.findUnique({ where: { key: apiKey }, include: { user: true } })
  if (!key || !key.isActive) return errorResponse(res, 'Invalid API key', 401)
  await prisma.apiKey.update({ where: { id: key.id }, data: { callsToday: { increment: 1 }, totalCalls: { increment: 1 }, lastUsed: new Date() } })
  req.user = { userId: key.userId, email: key.user.email, role: key.user.role }
  next()
}
