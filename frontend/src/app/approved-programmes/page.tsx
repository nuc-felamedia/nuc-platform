'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { Search, BookOpen, CheckCircle, Clock, XCircle, ChevronDown } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { api } from '@/lib/api'
import { cn } from '@/lib/utils'

const DEGREE_TYPES = ['', 'BSC', 'BA', 'BEng', 'BEd', 'MBBS', 'LLB', 'BTech', 'MSC', 'MA', 'PHD']
const STATUS_COLORS: Record<string, string> = {
  FULL:    'bg-green-100 text-green-700',
  INTERIM: 'bg-yellow-100 text-yellow-700',
  DENIED:  'bg-red-100 text-red-700',
  PENDING: 'bg-gray-100 text-gray-600',
}

export default function ApprovedProgrammesPage() {
  const [q, setQ]           = useState('')
  const [degree, setDegree] = useState('')
  const [page, setPage]     = useState(1)
  const [search, setSearch] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['programs', search, degree, page],
    queryFn: () => api.get('/programs', { params: { q: search, degreeType: degree, page, limit: 20 } }),
    select: (res) => res.data,
    enabled: true,
  })

  const programs = data?.data || []
  const pagination = data?.pagination

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    setSearch(q)
    setPage(1)
  }

  return (
    <PublicLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-2">NUC Database</div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Approved Programmes</h1>
          <p className="text-gray-500 max-w-2xl leading-relaxed">
            Search all academic programmes approved by the National Universities Commission across all Nigerian universities.
          </p>
        </div>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-3 flex-wrap">
            <div className="flex-1 min-w-64 relative">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by programme name or university..."
                value={q}
                onChange={e => setQ(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent"
              />
            </div>
            <select
              value={degree}
              onChange={e => { setDegree(e.target.value); setPage(1) }}
              className="px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="">All degrees</option>
              {DEGREE_TYPES.filter(d => d).map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <button type="submit"
              className="px-6 py-3 bg-brand-600 text-white rounded-xl text-sm font-semibold hover:bg-brand-700 transition-colors">
              Search
            </button>
          </div>
        </form>

        {/* Results count */}
        {!isLoading && (
          <p className="text-sm text-gray-500 mb-4">
            {pagination?.total?.toLocaleString() || programs.length} programmes found
            {search && ` for "${search}"`}
            {degree && ` · ${degree}`}
          </p>
        )}

        {/* Results */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-[3px] border-gray-200 border-t-brand-600 rounded-full animate-spin" />
          </div>
        ) : programs.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={40} className="mx-auto mb-4 text-gray-300" />
            <h3 className="font-semibold text-gray-700 mb-2">No programmes found</h3>
            <p className="text-gray-400 text-sm">Try a different search term or degree type</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Programme</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">University</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Faculty</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Degree</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((prog: any) => {
                    const accr = prog.accreditations?.[0]
                    return (
                      <tr key={prog.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="font-medium text-gray-900">{prog.name}</div>
                          <div className="text-xs text-gray-400 sm:hidden mt-0.5">{prog.university?.name}</div>
                        </td>
                        <td className="px-5 py-3.5 hidden sm:table-cell">
                          <Link href={`/universities/${prog.university?.slug}`}
                            className="text-brand-600 hover:text-brand-700 hover:underline">
                            {prog.university?.name}
                          </Link>
                        </td>
                        <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">
                          {prog.faculty?.name || '—'}
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-xs font-semibold bg-blue-50 text-blue-700 px-2 py-1 rounded-lg">
                            {prog.degreeType || '—'}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          {accr ? (
                            <span className={cn('text-xs font-semibold px-2 py-1 rounded-full', STATUS_COLORS[accr.status])}>
                              {accr.status}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-400">Not yet accredited</span>
                          )}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  ← Prev
                </button>
                <span className="text-sm text-gray-500">Page {page} of {pagination.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))} disabled={page === pagination.totalPages}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  )
}
