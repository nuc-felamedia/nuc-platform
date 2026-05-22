import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = { title: 'CCMAS — Core Curriculum and Minimum Academic Standards | NUC' }

const CCMAS_DOCS = [
  { label: 'Administration & Management', url: 'https://www.nuc.edu.ng/wp-content/uploads/2026/03/Administration-and-Management.pdf' },
  { label: 'Allied Health Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2026/03/Allied-Health-Sciences-2023.pdf' },
  { label: 'Agriculture', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Agriculture.pdf' },
  { label: 'Arts & Humanities', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Arts-and-Humanities.pdf' },
  { label: 'Basic Medical Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Basic-Medical-Sciences.pdf' },
  { label: 'Clinical Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Clinical-Sciences.pdf' },
  { label: 'Education', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Education.pdf' },
  { label: 'Engineering & Technology', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Engineering-and-Technology.pdf' },
  { label: 'Environmental Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Environmental-Sciences.pdf' },
  { label: 'Law', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Law.pdf' },
  { label: 'Natural Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Natural-Sciences.pdf' },
  { label: 'Pharmaceutical Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Pharmaceutical-Sciences.pdf' },
  { label: 'Social Sciences', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Social-Sciences.pdf' },
  { label: 'Veterinary Medicine', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/03/Veterinary-Medicine.pdf' },
]

export default function CCMASPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link><span>›</span>
          <span className="text-gray-600">CCMAS</span>
        </nav>
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Academic Standards</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Core Curriculum and Minimum Academic Standards</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            The CCMAS documents define the minimum academic standards for all undergraduate programmes in Nigerian universities.
            Download the relevant discipline document below.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CCMAS_DOCS.map(doc => (
            <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
              <div className="flex items-center gap-3">
                <span className="text-xl">📋</span>
                <span className="text-sm font-medium text-gray-800 group-hover:text-brand-700">{doc.label}</span>
              </div>
              <span className="text-xs text-brand-600 font-medium shrink-0">PDF →</span>
            </a>
          ))}
        </div>
        <div className="mt-8 p-5 bg-brand-50 rounded-2xl border border-brand-100 text-sm text-brand-700">
          For the complete and updated list of CCMAS documents, visit{' '}
          <a href="https://www.nuc.edu.ng/ccmas/" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            www.nuc.edu.ng/ccmas
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
