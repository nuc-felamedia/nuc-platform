process.env.DATABASE_URL = "postgresql://postgres:BYThhltILWLQxteSalHjlVHnrihHhaDb@nozomi.proxy.rlwy.net:16303/railway";

const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient({
  datasources: { db: { url: "postgresql://postgres:BYThhltILWLQxteSalHjlVHnrihHhaDb@nozomi.proxy.rlwy.net:16303/railway" } }
});

const dirs = [
  { slug: 'academic-planning', name: 'Mallam Abubakar Muhammad Girei', title: 'Director, Academic Planning', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3044.jpg' },
  { slug: 'inspection-and-monitoring', name: 'Mrs. Justina Onyema Emerole', title: 'Director, Inspection & Monitoring', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Mrs.-Emerole-scaled.jpg' },
  { slug: 'finance-accounts', name: 'Dr. Zakariya Sini Kwanta', title: 'Director, Finance and Accounts', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Zachary-Kwanta.jpeg' },
  { slug: 'human-resources', name: 'Mrs. Alissabatu Balogun', title: 'Director, Human Resources', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/02/Mrs-Balogun.jpg' },
  { slug: 'ict', name: 'Mal. Lawal Mohammed Faruk', title: 'Director, Research Innovations & IT', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3043-e1750085770353.jpg' },
  { slug: 'press-public-relations', name: 'Ms. Rita Nneka Okonjo', title: 'Director, Public Affairs', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Rita-Okonjo-1.jpg' },
  { slug: 'legal-services', name: 'Mr. Ashafa Ladan', title: 'Director, Establishment of Private Universities', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/02/WhatsApp-Image-2025-06-16-at-10.48.43-e1750068364940.jpeg' },
  { slug: 'quality-assurance', name: 'Dr. Funmilayo Morebise', title: 'Director, Open Distance & e-Learning', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3048.jpg' },
  { slug: 'physical-planning', name: 'Dr. Joshua Atah', title: 'Director, Special Projects', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/DSC_6670.jpeg' },
  { slug: 'research-innovations', name: 'Dr. Esther Imuetinyan Mmeka', title: 'Director, Skills Development & Entrepreneurship', photo: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Esther-Mmeka-1-scaled.jpg' },
];

async function run() {
  const all = await p.directorate.findMany({ select: { id: true, slug: true } });
  console.log('Found:', all.map(d => d.slug).join(', '));
  for (const d of dirs) {
    const dir = all.find(x => x.slug === d.slug);
    if (dir) {
      await p.directorate.update({ where: { id: dir.id }, data: { directorName: d.name, directorTitle: d.title, directorPhotoUrl: d.photo } });
      console.log('✅', d.slug);
    } else {
      console.log('❌ Not found:', d.slug);
    }
  }
  await p.$disconnect();
  console.log('Done!');
}

run().catch(e => { console.error(e.message); process.exit(1); });
