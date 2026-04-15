// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export class AppError extends Error {
  statusCode: number
  isOperational: boolean

  constructor(message: string, statusCode = 500) {
    super(message)
    this.statusCode = statusCode
    this.isOperational = true
    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  let statusCode = err.statusCode || 500
  let message = err.message || 'Internal server error'

  // Prisma errors
  if (err.code === 'P2002') { statusCode = 409; message = 'A record with this value already exists' }
  if (err.code === 'P2025') { statusCode = 404; message = 'Record not found' }
  if (err.code === 'P2003') { statusCode = 400; message = 'Invalid reference — related record not found' }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { statusCode = 401; message = 'Invalid token' }
  if (err.name === 'TokenExpiredError') { statusCode = 401; message = 'Token expired' }

  logger.error(`${req.method} ${req.url} — ${statusCode}: ${message}`)
  if (process.env.NODE_ENV === 'development') logger.error(err.stack)

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  })
}

export function notFound(req: Request, res: Response) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` })
}
