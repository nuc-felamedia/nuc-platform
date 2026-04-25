// src/routes/admin.routes.ts
import { Router } from 'express'
import { getDashboard, getUsers, updateUserRole, toggleUserActive, assignUniversity } from '../controllers/admin.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.use(authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'))
router.get('/dashboard', getDashboard)
router.get('/users', getUsers)
router.patch('/users/:id/role', updateUserRole)
router.patch('/users/:id/toggle', toggleUserActive)
router.put('/users/:id/university', assignUniversity)
export default router
