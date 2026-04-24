// ─────────────────────────────────────────────────────────────────────────────
// REPLACE backend/src/routes/directorate.routes.ts with this
// ─────────────────────────────────────────────────────────────────────────────
import { Router } from 'express'
import {
  getDirectorates,
  getDirectorate,
  getMyStaffProfile,
  upsertStaffProfile,
  getDivisionsForProfile,
} from '../controllers/directorate.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()

// Public
router.get('/', getDirectorates)
router.get('/:slug', getDirectorate)

// Staff profile — authenticated
router.get('/staff/profile', authenticate, getMyStaffProfile)
router.post('/staff/profile', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), upsertStaffProfile)
router.get('/staff/divisions', authenticate, getDivisionsForProfile)

export default router
