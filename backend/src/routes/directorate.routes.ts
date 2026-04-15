// src/routes/directorate.routes.ts
import { Router } from 'express'
import { getDirectorates, getDirectorate, createDirectorate, updateDirectorate } from '../controllers/directorate.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getDirectorates)
router.get('/:slug', getDirectorate)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createDirectorate)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateDirectorate)
export default router
