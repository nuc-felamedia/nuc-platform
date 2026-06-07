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
router.post('/seed-directors', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  const dirs = [
    { slug: 'academic-planning', name: 'Mallam Abubakar Muhammad Girei', title: 'Director, Academic Planning', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3044.jpg' },
    { slug: 'inspection-and-monitoring', name: 'Mrs. Justina Onyema Emerole', title: 'Director, Inspection & Monitoring', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Mrs.-Emerole-scaled.jpg' },
    { slug: 'inspection', name: 'Mrs. Justina Onyema Emerole', title: 'Director, Inspection & Monitoring', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Mrs.-Emerole-scaled.jpg' },
    { slug: 'ict-and-digital-services', name: 'Mal. Lawal Mohammed Faruk', title: 'Director, Research Innovations & IT', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3043-e1750085770353.jpg' },
    { slug: 'finance-and-accounts', name: 'Dr. Zakariya Sini Kwanta', title: 'Director, Finance and Accounts', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Zachary-Kwanta.jpeg' },
    { slug: 'research-and-innovation', name: 'Mal. Lawal Mohammed Faruk', title: 'Director, Research Innovations & IT', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3043-e1750085770353.jpg' },
    { slug: 'finance-accounts', name: 'Dr. Zakariya Sini Kwanta', title: 'Director, Finance and Accounts', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Zachary-Kwanta.jpeg' },
    { slug: 'human-resources', name: 'Mrs. Alissabatu Balogun', title: 'Director, Human Resources', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/02/Mrs-Balogun.jpg' },
    { slug: 'ict', name: 'Mal. Lawal Mohammed Faruk', title: 'Director, Research Innovations & IT', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3043-e1750085770353.jpg' },
    { slug: 'press-public-relations', name: 'Ms. Rita Nneka Okonjo', title: 'Director, Public Affairs', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Rita-Okonjo-1.jpg' },
    { slug: 'legal-services', name: 'Mr. Ashafa Ladan', title: 'Director, Establishment of Private Universities', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/02/WhatsApp-Image-2025-06-16-at-10.48.43-e1750068364940.jpeg' },
    { slug: 'quality-assurance', name: 'Dr. Funmilayo Morebise', title: 'Director, Open Distance & e-Learning', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3048.jpg' },
    { slug: 'physical-planning', name: 'Dr. Joshua Atah', title: 'Director, Special Projects', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/DSC_6670.jpeg' },
    { slug: 'research-innovations', name: 'Dr. Esther Imuetinyan Mmeka', title: 'Director, Skills Development & Entrepreneurship', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Esther-Mmeka-1-scaled.jpg' },
    { slug: 'accreditation', name: 'Dr. Chinelo Jacinta Nwosu', title: 'Director, Students', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Chinelo-Nwosu-1.jpg' },
  ]
  const all = await prisma.directorate.findMany({ select: { id: true, slug: true } })
  const results: any[] = []
  for (const d of dirs) {
    const dir = all.find((x: any) => x.slug === d.slug)
    if (dir) {
      await prisma.directorate.update({ where: { id: dir.id }, data: { directorName: d.name, directorTitle: d.title, directorPhotoUrl: d.photo } })
      results.push({ slug: d.slug, status: 'updated' })
    } else {
      results.push({ slug: d.slug, status: 'not found' })
    }
  }
  res.json({ success: true, results, slugsInDB: all.map((x: any) => x.slug) })
})

// Directorate management
router.post('/directorates', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    const dir = await prisma.directorate.create({ data: req.body })
    res.json({ success: true, data: dir })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})
router.delete('/directorates/:id', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    await prisma.directorate.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Directorate deleted' })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})

router.patch('/directorates/:id', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    const updated = await prisma.directorate.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: updated })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})

// Directorate management
router.post('/directorates', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    const dir = await prisma.directorate.create({ data: req.body })
    res.json({ success: true, data: dir })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})
router.delete('/directorates/:id', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    await prisma.directorate.delete({ where: { id: req.params.id } })
    res.json({ success: true, message: 'Directorate deleted' })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})

router.patch('/directorates/:id', async (req: any, res: any) => {
  const { prisma } = require('../utils/prisma')
  try {
    const updated = await prisma.directorate.update({
      where: { id: req.params.id },
      data: req.body
    })
    res.json({ success: true, data: updated })
  } catch (e: any) {
    res.status(400).json({ success: false, message: e.message })
  }
})

export default router
