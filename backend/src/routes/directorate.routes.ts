// REPLACE backend/src/routes/directorate.routes.ts with this entire file

import { Router } from 'express'
import {
  getDirectorates, getDirectorate,
  getAllDirectoratesAdmin, createDirectorate, updateDirectorate,
  createDivision, updateDivision, deleteDivision,
  createStaff, updateStaff, deleteStaff, getStaffInDivision,
  getMyStaffProfile, upsertStaffProfile,
} from '../controllers/directorate.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
const isAdmin = [authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN')]

// Public
router.get('/', getDirectorates)
router.get('/:slug', getDirectorate)

// Admin — directorates
router.get('/admin/all', ...isAdmin, getAllDirectoratesAdmin)
router.post('/', ...isAdmin, createDirectorate)
router.put('/:id', ...isAdmin, updateDirectorate)

// Admin — divisions
router.post('/divisions', ...isAdmin, createDivision)
router.put('/divisions/:id', ...isAdmin, updateDivision)
router.delete('/divisions/:id', ...isAdmin, deleteDivision)

// Admin — staff
router.get('/divisions/:divisionId/staff', ...isAdmin, getStaffInDivision)
router.post('/staff', ...isAdmin, createStaff)
router.put('/staff/:id', ...isAdmin, updateStaff)
router.delete('/staff/:id', ...isAdmin, deleteStaff)

// Staff self-profile
router.get('/staff/profile', authenticate, getMyStaffProfile)
router.post('/staff/profile', authenticate, upsertStaffProfile)

export default router
