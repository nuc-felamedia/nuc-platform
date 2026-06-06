import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = {
  title: 'Board Members — National Universities Commission',
  description: 'Members of the NUC Governing Council',
}

const BOARD_MEMBERS = [
  {
    name: 'Emeritus Prof. Oluremi Raphael Aina, OFR',
    title: 'Chairman, NUC Governing Council',
    bio: 'Emeritus Professor of Business and Technical Education. Former Registrar and Chief Executive Officer of the National Business and Technical Examination Board (1992–2002). Former Member, Independent Corrupt Practices and Other Related Offences Commission (ICPC) from 2011 to 2015. Appointed as the 13th Chairman of the NUC Governing Council on 1st July, 2025.',
    photo: null,
  },
  {
    name: 'Prof. Abdullahi Yusufu Ribadu, FCVSN',
    title: 'Executive Secretary, NUC',
    bio: 'The 9th substantive Executive Secretary of the National Universities Commission, appointed with effect from 6th December 2024. Professor of Veterinary Reproduction, former Vice-Chancellor of FUTY (2004–2009) and Jigawa State University (2013).',
    photo: '/es-photo.jpg',
  },
]

export default function BoardMembersPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link>
          <span>›</span>
          <Link href="/about" className="hover:text-brand-600">About</Link>
          <span>›</span>
          <span className="text-gray-600">Board Members</span>
        </nav>

        <div className="mb-10">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Governing Council</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">NUC Board Members</h1>
          <p className="text-gray-500 leading-relaxed max-w-2xl">
            The Governing Council is the highest policy-making body of the National Universities Commission,
            responsible for institutional governance, policy formulation, financial oversight, and ensuring
            academic and administrative excellence.
          </p>
        </div>

        <div className="space-y-6 mb-10">
          {BOARD_MEMBERS.map(member => (
            <div key={member.name} className="flex flex-col sm:flex-row gap-6 p-6 bg-white rounded-2xl border border-gray-100">
              {member.photo ? (
                <img src={member.photo} alt={member.name}
                  className="w-28 h-28 rounded-xl object-cover object-top border border-gray-100 shrink-0" />
              ) : (
                <div className="w-28 h-28 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 border border-brand-100">
                  <span className="text-3xl font-bold text-brand-600">
                    {member.name.split(' ').find(w => w.length > 2)?.[0] || 'N'}
                  </span>
                </div>
              )}
              <div>
                <h2 className="font-display text-lg font-bold text-gray-900 mb-1">{member.name}</h2>
                <p className="text-sm text-brand-600 font-medium mb-3">{member.title}</p>
                <p className="text-sm text-gray-600 leading-relaxed">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 bg-amber-50 rounded-2xl border border-amber-100 text-sm text-amber-800">
          <strong>Note:</strong> The full list of Governing Council members will be updated as information becomes available from NUC.
          For official inquiries, contact{' '}
          <a href="mailto:info@nuc.edu.ng" className="underline font-medium">info@nuc.edu.ng</a>
        </div>
      </div>
    </PublicLayout>
  )
}
