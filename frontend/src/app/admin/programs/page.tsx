'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { api } from '@/lib/api'
import { PageLoader, EmptyState } from '@/components/ui'
import { formatDateShort } from '@/lib/utils'

export default function AdminProgramsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-programs'],
    queryFn: () => api.get('/programs?limit=50'),
    select: (res) => res.data?.data || [],
  })

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-gray-500 text-sm mt-1">{data?.length || 0} programs loaded</p>
        </div>
        <Link href="/admin/programs/new"
          className="px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors">
          + Add program
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        {!data?.length ? (
          <EmptyState title="No programs found" description="Programs will appear here" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Program</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">University</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase hidden md:table-cell">Faculty</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Degree</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.map((prog: any) => {
                  const accr = prog.accreditations?.[0]
                  return (
                    <tr key={prog.id} className="border-b border-gray-50 hover:bg-gray-50">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{prog.name}</td>
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{prog.university?.name}</td>
                      <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{prog.faculty?.name}</td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">{prog.degreeType}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        {accr ? (
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                            accr.status === 'FULL' ? 'bg-green-100 text-green-700' :
                            accr.status === 'INTERIM' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{accr.status}</span>
                        ) : (
                          <span className="text-xs text-gray-400">None</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
