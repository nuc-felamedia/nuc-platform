// src/routes/post.routes.ts
import { Router } from 'express'
import { getPosts, getPost, createPost, updatePost, deletePost } from '../controllers/post.controller'
import { authenticate, requireRole } from '../middleware/auth'

const router = Router()
router.get('/', getPosts)
router.get('/:slug', getPost)
router.post('/', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), createPost)
router.put('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), updatePost)
router.delete('/:id', authenticate, requireRole('NUC_STAFF', 'SUPER_ADMIN'), deletePost)
export default router
