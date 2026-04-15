'use client'
// src/app/accreditation/page.tsx
import { useState, useCallback } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Download, ChevronDown, ChevronUp } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Input, Select, AccreditationBadge, PageLoader, EmptyState, Pagination, Button } from '@/components/ui'
import { accreditationApi } from '@/lib/api'
import { cn, formatDate } from '@/lib/utils'
import Link from 'next/link'

const STATUSES = ['', 'FULL', 'INTERIM', 'DENIED', 'PENDING']
const STATUS_LABELS: Record<string, string> = {
  '': 'All statuses', FULL: 'Full', INTERIM: 'Interim', DENIED: 'Denied', PENDING: 'Pending',
}

export default function AccreditationPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const { data, isLoading } = useQuery({
    queryKey: ['accreditation', q, status, year, page],
    queryFn: () => accreditationApi.getAll({ q, status, year, page, limit: 20 }),
    select: (res) => res.data,
  })

  const records = data?.data || []
  const pagination = data?.pagination

  const toggleRow = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Accreditation Results</h1>
          <p className="text-gray-500">Search and filter all NUC accreditation records across Nigerian universities</p>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => { setStatus(s); setPage(1) }}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all',
                status === s
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              )}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>

        {/* Search + filters bar */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6">
          <div className="flex flex-wrap gap-3">
            <div className="flex-1 min-w-48">
              <Input
                placeholder="Search university or program..."
                value={q}
                onChange={(e) => { setQ(e.target.value); setPage(1) }}
              />
            </div>
            <Select value={year} onChange={(e) => { setYear(e.target.value); setPage(1) }} className="w-36">
              <option value="">All years</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </Select>
            <Button
              variant="outline"
              size="md"
              onClick={() => {
                const params = new URLSearchParams({ q, status, year }).toString()
                window.open(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/accreditation/export?${params}`)
              }}
            >
              <Download size={15} /> Export CSV
            </Button>
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-500">
            {isLoading ? 'Loading...' : `${(pagination?.total || 0).toLocaleString()} records found`}
          </p>
          <p className="text-xs text-gray-400 hidden sm:block">Click any row to expand details</p>
        </div>

        {/* Table */}
        {isLoading ? (
          <PageLoader />
        ) : records.length === 0 ? (
          <EmptyState
            title="No accreditation records found"
            description="Try adjusting your search query or filters"
          />
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {/* Desktop table header */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">University</div>
              <div className="col-span-3">Program</div>
              <div className="col-span-2">Faculty</div>
              <div className="col-span-1">Degree</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">Year</div>
            </div>

            {records.map((record: any) => {
              const isExpanded = expandedId === record.id
              const uni = record.program?.university
              const prog = record.program
              const faculty = prog?.faculty

              return (
                <div key={record.id} className="border-b border-gray-50 last:border-0">
                  {/* Row */}
                  <div
                    className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-4 sm:px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors items-center"
                    onClick={() => toggleRow(record.id)}
                  >
                    {/* University */}
                    <div className="col-span-1 sm:col-span-4">
                      <Link
                        href={`/universities/${uni?.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-semibold text-gray-900 text-sm hover:text-brand-600 transition-colors block"
                      >
                        {uni?.name}
                      </Link>
                      <span className="text-xs text-gray-400">{uni?.state} · {uni?.type?.charAt(0) + uni?.type?.slice(1).toLowerCase()}</span>
                    </div>
                    {/* Program */}
                    <div className="col-span-1 sm:col-span-3 text-sm text-gray-700">{prog?.name}</div>
                    {/* Faculty */}
                    <div className="hidden sm:block col-span-2 text-sm text-gray-500">{faculty?.name || '—'}</div>
                    {/* Degree */}
                    <div className="hidden sm:block col-span-1 text-xs font-mono text-gray-500">{prog?.degreeType}</div>
                    {/* Status */}
                    <div className="col-span-1">
                      <AccreditationBadge status={record.status} />
                    </div>
                    {/* Year + expand icon */}
                    <div className="hidden sm:flex col-span-1 items-center justify-between text-sm text-gray-500">
                      {record.year}
                      {isExpanded ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                        {[
                          { label: 'Program', value: prog?.name },
                          { label: 'Accreditation status', value: record.status },
                          { label: 'Year assessed', value: record.year },
                          { label: 'Valid until', value: record.expiryDate ? new Date(record.expiryDate).getFullYear() : 'N/A' },
                          { label: 'University', value: uni?.name },
                          { label: 'Faculty', value: faculty?.name || '—' },
                          { label: 'Degree type', value: prog?.degreeType },
                          { label: 'University type', value: uni?.type },
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                            <div className="text-xs text-gray-400 mb-1">{label}</div>
                            <div className="text-sm font-semibold text-gray-800">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                      {record.notes && (
                        <div className="bg-blue-50 rounded-xl p-3 mb-4 text-sm text-blue-800">{record.notes}</div>
                      )}
                      <div className="flex gap-3">
                        <Link href={`/universities/${uni?.slug}`}>
                          <Button variant="outline" size="sm">View university →</Button>
                        </Link>
                        <Link href={`/accreditation/verify?university=${uni?.slug}&program=${prog?.slug}`}>
                          <Button variant="secondary" size="sm">Verify this program →</Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {pagination && (
          <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
        )}
      </div>
    </PublicLayout>
  )
}
