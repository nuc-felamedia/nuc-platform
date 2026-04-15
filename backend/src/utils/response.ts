// src/utils/response.ts
import { Response } from 'express'

export function successResponse(res: Response, data: any, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({ success: true, message, data })
}

export function errorResponse(res: Response, message: string, statusCode = 400, errors?: any) {
  return res.status(statusCode).json({ success: false, message, ...(errors && { errors }) })
}

export function paginatedResponse(
  res: Response,
  data: any[],
  total: number,
  page: number,
  limit: number,
  message = 'Success'
) {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrev: page > 1,
    },
  })
}
