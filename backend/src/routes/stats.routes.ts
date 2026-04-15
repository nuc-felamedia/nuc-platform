// src/routes/stats.routes.ts
import { Router } from 'express'
import { getStats } from '../controllers/stats.controller'
const router = Router()
router.get('/', getStats)
export default router

// ─────────────────────────────────────────────
// src/routes/search.routes.ts  (inlined here)
// ─────────────────────────────────────────────
