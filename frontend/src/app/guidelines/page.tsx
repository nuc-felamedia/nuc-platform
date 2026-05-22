import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = {
  title: 'Guidelines & Documents — National Universities Commission',
  description: 'Official NUC guideline documents, statistical digests, and directory of full professors.',
}

const SECTIONS = [
  {
    title: 'Guideline Documents',
    icon: '📋',
    description: 'Official NUC guidelines governing university education in Nigeria',
    docs: [
      { label: 'Transnational Education Guideline', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/10/TNE-Guidelines-2023.pdf' },
      { label: 'Guideline on e-Learning in NUS', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/10/e-Learning-Guidelines-2023.pdf' },
      { label: 'Open Education Resources Policy', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/10/OER-Policy-2023.pdf' },
      { label: 'Code of Governance for Private Universities', url: 'https://www.nuc.edu.ng/wp-content/uploads/2023/10/Code-of-Governance-2023.pdf' },
      { label: 'Guidelines for Award and Use of Honorary Degrees in Nigeria', url: 'https://www.nuc.edu.ng/guidelines-for-the-award-and-use-of-honorary-degrees-in-nigeria/' },
      { label: 'NUC Act', url: 'http://www.nuc.edu.ng/wp-content/uploads/2019/06/NUC-Act0001.pdf' },
    ],
  },
  {
    title: 'Statistical Digest',
    icon: '📊',
    description: 'Annual statistical publications on the Nigerian University System',
    docs: [
      { label: 'Statistical Digest 2019', url: 'https://www.nuc.edu.ng/wp-content/uploads/2020/01/2019-Statistical-Digest.pdf' },
      { label: 'Statistical Digest 2018', url: 'https://www.nuc.edu.ng/wp-content/uploads/2019/06/2018-Statistical-Digest.pdf' },
      { label: 'Statistical Digest 2017', url: 'https://www.nuc.edu.ng/nuc-statistical-digest-2017/' },
    ],
  },
  {
    title: 'Directory of Full Professors',
    icon: '🎓',
    description: 'Directory of full professors in the Nigerian University System',
    docs: [
      { label: 'Directory of Full Professors (2021)', url: 'https://www.nuc.edu.ng/wp-content/uploads/2022/01/Directory-of-Full-Professors-2021.pdf' },
      { label: 'Directory of Full Professors (2017)', url: 'https://www.nuc.edu.ng/wp-content/uploads/2018/09/Directory-of-Full-Professors-2017.pdf' },
    ],
  },
  {
    title: 'Special Projects & Publications',
    icon: '🔬',
    description: 'Research publications and special project documents',
    docs: [
      { label: 'Blueprint for Rapid Revitalisation of University Education (2019–2023)', url: 'https://www.nuc.edu.ng/wp-content/uploads/2019/06/NUC-Blueprint.pdf' },
      { label: 'The State of University Education in Nigeria (2017)', url: 'https://www.nuc.edu.ng/wp-content/uploads/2018/09/State-of-University-Education.pdf' },
    ],
  },
]

export default function GuidelinesPage() {
  return (
    <PublicLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <span className="text-gray-600">Guidelines & Documents</span>
        </nav>

        <div className="mb-10">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Resources</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">Guidelines & Documents</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            Official NUC guideline documents, statistical digests, directories and publications
            for the Nigerian University System.
          </p>
        </div>

        <div className="space-y-10">
          {SECTIONS.map(section => (
            <div key={section.title}>
              <div className="flex items-center gap-3 mb-5">
                <span className="text-2xl">{section.icon}</span>
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">{section.title}</h2>
                  <p className="text-sm text-gray-500">{section.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {section.docs.map(doc => (
                  <a
                    key={doc.label}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-brand-200 hover:bg-brand-50 transition-all group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="text-lg shrink-0">📄</span>
                      <span className="text-sm font-medium text-gray-800 group-hover:text-brand-700 truncate">
                        {doc.label}
                      </span>
                    </div>
                    <span className="text-xs text-brand-600 font-medium shrink-0 ml-3">
                      View →
                    </span>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-5 bg-brand-50 rounded-2xl border border-brand-100 text-sm text-brand-700">
          For the complete and most up-to-date list of NUC publications and guidelines, visit{' '}
          <a href="https://www.nuc.edu.ng" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            www.nuc.edu.ng
          </a>
        </div>
      </div>
    </PublicLayout>
  )
}
