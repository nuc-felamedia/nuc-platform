// src/routes/accreditation.routes.ts
import { Router } from 'express'
import { getAccreditations, getAccreditation, createAccreditation, updateAccreditation, checkAccreditation } from '../controllers/accreditation.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getAccreditations)
router.get('/check', checkAccreditation)
router.get('/:id', getAccreditation)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createAccreditation)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateAccreditation)
export default router
