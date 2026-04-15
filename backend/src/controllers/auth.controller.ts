// src/controllers/auth.controller.ts
import { Request, Response } from 'express'
import bcrypt from 'bcryptjs'
import { prisma } from '../utils/prisma'
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt'
import { successResponse, errorResponse } from '../utils/response'
import { AuthRequest } from '../middleware/auth'

export async function register(req: Request, res: Response) {
  const { email, password, firstName, lastName } = req.body

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) return errorResponse(res, 'Email already registered', 409)

  const hashed = await bcrypt.hash(password, 12)
  const user = await prisma.user.create({
    data: { email, password: hashed, firstName, lastName },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  })

  const accessToken = generateAccessToken({ userId: user.id, email: user.email, role: user.role })
  const refreshToken = generateRefreshToken({ userId: user.id, email: user.email, role: user.role })

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return successResponse(res, { user, accessToken }, 'Registration successful', 201)
}

export async function login(req: Request, res: Response) {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || !user.isActive) return errorResponse(res, 'Invalid credentials', 401)

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) return errorResponse(res, 'Invalid credentials', 401)

  await prisma.user.update({ where: { id: user.id }, data: { lastLogin: new Date() } })

  const payload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = generateAccessToken(payload)
  const refreshToken = generateRefreshToken(payload)

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  const { password: _, ...safeUser } = user
  return successResponse(res, { user: safeUser, accessToken }, 'Login successful')
}

export async function refreshToken(req: Request, res: Response) {
  const token = req.cookies?.refreshToken
  if (!token) return errorResponse(res, 'No refresh token', 401)

  const payload = verifyRefreshToken(token)
  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user || !user.isActive) return errorResponse(res, 'User not found', 401)

  const newPayload = { userId: user.id, email: user.email, role: user.role }
  const accessToken = generateAccessToken(newPayload)
  const newRefresh = generateRefreshToken(newPayload)

  res.cookie('refreshToken', newRefresh, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  })

  return successResponse(res, { accessToken }, 'Token refreshed')
}

export async function logout(_req: Request, res: Response) {
  res.clearCookie('refreshToken')
  return successResponse(res, null, 'Logged out successfully')
}

export async function getMe(req: AuthRequest, res: Response) {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true, isVerified: true, lastLogin: true, subscription: true },
  })
  if (!user) return errorResponse(res, 'User not found', 404)
  return successResponse(res, user)
}
