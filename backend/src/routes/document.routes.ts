// src/routes/document.routes.ts
import { Router } from 'express'
import { getDocuments, getDocument, createDocument, updateDocument, deleteDocument } from '../controllers/document.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getDocuments)
router.get('/:slug', getDocument)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createDocument)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updateDocument)
router.delete('/:id', authenticate, requireRole('SUPER_ADMIN'), deleteDocument)
export default router
