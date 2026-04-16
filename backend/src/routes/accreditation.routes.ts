// ─────────────────────────────────────────────────────────────────────────────
// REPLACE backend/src/routes/accreditation.routes.ts with this entire file
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express'
import {
  getAccreditations,
  getAccreditation,
  createAccreditation,
  updateAccreditation,
  checkAccreditation,
  getProgramHistory,
} from '../controllers/accreditation.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getAccreditations)
router.get('/check', checkAccreditation)
router.get('/history/:programId', getProgramHistory)
router.get('/:id', getAccreditation)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createAccreditation)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateAccreditation)
export default router
