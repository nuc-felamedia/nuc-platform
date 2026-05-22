import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = { title: 'Part-Time Programmes — National Universities Commission' }

export default function PartTimePage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link><span>›</span>
          <span className="text-gray-600">Part-Time Programmes</span>
        </nav>
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Flexible Learning</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Part-Time Programmes</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Part-time degree programmes approved by the National Universities Commission in Nigerian universities.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="font-display text-xl font-bold text-gray-900 mb-3">Part-Time Programme Information</h2>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            For the complete list of approved part-time programmes in Nigerian universities, please visit the official NUC website.
          </p>
          <a href="https://www.nuc.edu.ng/part-time-courses/" target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-brand-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-brand-700 transition-colors">
            View on NUC website →
          </a>
        </div>
        <div className="mt-8 prose prose-gray max-w-none">
          <h2>About Part-Time Programmes</h2>
          <p>
            The National Universities Commission regulates part-time degree programmes in Nigerian universities to ensure
            they meet the same minimum academic standards as full-time programmes. Universities must obtain NUC approval
            before admitting students into any part-time programme.
          </p>
          <h2>Requirements</h2>
          <ul>
            <li>Part-time programmes must have the same curriculum as their full-time equivalents</li>
            <li>Minimum duration for part-time programmes is 1.5 times the full-time duration</li>
            <li>All part-time lecturers must meet NUC minimum qualifications</li>
            <li>Universities must apply for and receive NUC approval before running any part-time programme</li>
          </ul>
        </div>
      </div>
    </PublicLayout>
  )
}
