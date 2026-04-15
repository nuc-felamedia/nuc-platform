// src/routes/university.routes.ts
import { Router } from 'express'
import { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity, getStates } from '../controllers/university.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getUniversities)
router.get('/states', getStates)
router.get('/:slug', getUniversity)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createUniversity)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateUniversity)
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), deleteUniversity)
export default router
