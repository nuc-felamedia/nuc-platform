// src/routes/university.routes.ts
import { Router } from 'express'
import { getUniversities, getUniversity, createUniversity, updateUniversity, deleteUniversity, getStates, getMyUniversity, updateMyUniversity, getMyPrograms, getMyUniversityStats } from '../controllers/university.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getUniversities)
router.get('/states', getStates)
router.get('/:slug', getUniversity)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createUniversity)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateUniversity)
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), deleteUniversity)

// University admin self-service routes
router.get('/my', authenticate, requireRole('UNIVERSITY_ADMIN', 'SUPER_ADMIN'), getMyUniversity)
router.put('/my', authenticate, requireRole('UNIVERSITY_ADMIN', 'SUPER_ADMIN'), updateMyUniversity)
router.get('/my/programs', authenticate, requireRole('UNIVERSITY_ADMIN', 'SUPER_ADMIN'), getMyPrograms)
router.get('/my/stats', authenticate, requireRole('UNIVERSITY_ADMIN', 'SUPER_ADMIN'), getMyUniversityStats)

export default router
