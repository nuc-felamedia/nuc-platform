import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = { title: 'Freedom of Information — National Universities Commission' }

const DOCS = [
  { label: 'NUC Act', url: 'http://www.nuc.edu.ng/wp-content/uploads/2019/06/NUC-Act0001.pdf' },
  { label: 'Freedom of Information Act', url: 'http://www.nuc.edu.ng/wp-content/uploads/2019/06/Freedom-Of-Information-Act.pdf' },
]

export default function FreedomOfInformationPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link><span>›</span>
          <span className="text-gray-600">Freedom of Information</span>
        </nav>
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Transparency</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Freedom of Information</h1>
        </div>
        <div className="prose prose-gray max-w-none mb-10">
          <h2>NUC Act & FOI Act</h2>
          <p>The documents below are available for download in accordance with the Freedom of Information Act.</p>
        </div>
        <div className="grid gap-4 mb-10">
          {DOCS.map(doc => (
            <a key={doc.label} href={doc.url} target="_blank" rel="noopener noreferrer"
              className="flex items-center justify-between p-5 bg-white rounded-2xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📄</span>
                <span className="font-medium text-gray-800 group-hover:text-brand-700">{doc.label}</span>
              </div>
              <span className="text-sm text-brand-600 font-medium">Download PDF →</span>
            </a>
          ))}
        </div>
        <div className="prose prose-gray max-w-none">
          <h2>Statistics of Treated FOI Cases</h2>
          <p>The Commission received three (3) requests under the FOI Act between 2014 and 2017 and responded timeously to all requests.</p>
          <h2>Submit an FOI Request</h2>
          <p>To submit a Freedom of Information request, please write to:</p>
          <p>
            The Executive Secretary<br />
            National Universities Commission<br />
            Plot 430, Aguiyi Ironsi Street, Maitama<br />
            Abuja, FCT — Nigeria<br />
            Email: <a href="mailto:info@nuc.edu.ng">info@nuc.edu.ng</a>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}
