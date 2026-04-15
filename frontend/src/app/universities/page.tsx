'use client'
// src/app/universities/page.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import PublicLayout from '@/components/layout/PublicLayout'
import UniversityCard from '@/components/universities/UniversityCard'
import { Input, Select, PageLoader, EmptyState, Pagination } from '@/components/ui'
import { universitiesApi } from '@/lib/api'
import { UniversityType } from '@/types'
import { cn } from '@/lib/utils'

const TYPES: { label: string; value: string }[] = [
  { label: 'All universities', value: '' },
  { label: 'Federal (74)', value: 'FEDERAL' },
  { label: 'State (67)', value: 'STATE' },
  { label: 'Private (100)', value: 'PRIVATE' },
  { label: 'Transnational', value: 'TRANSNATIONAL' },
  { label: 'Distance learning', value: 'DISTANCE_LEARNING' },
]

export default function UniversitiesPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [state, setState] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['universities', q, type, state, page],
    queryFn: () => universitiesApi.getAll({ q, type, state, page, limit: 12 }),
    select: (res) => res.data,
  })

  const universities = data?.data || []
  const pagination = data?.pagination

  return (
    <PublicLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Nigerian Universities</h1>
          <p className="text-gray-500">Browse all {pagination?.total || 241} NUC-approved universities</p>
        </div>

        {/* Type tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
          {TYPES.map((t) => (
            <button
              key={t.value}
              onClick={() => { setType(t.value); setPage(1) }}
              className={cn(
                'shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-all',
                type === t.value
                  ? 'bg-brand-600 text-white border-brand-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-6 flex-wrap">
          <div className="flex-1 min-w-52">
            <Input
              placeholder="Search universities..."
              value={q}
              onChange={(e) => { setQ(e.target.value); setPage(1) }}
            />
          </div>
          <Select value={state} onChange={(e) => { setState(e.target.value); setPage(1) }} className="w-40">
            <option value="">All states</option>
            {['Abia', 'Abuja', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa', 'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu', 'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi', 'Kwara', 'Lagos', 'Nasarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo', 'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara'].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
        </div>

        {/* Results count */}
        <div className="text-sm text-gray-500 mb-5">
          {isLoading ? 'Loading...' : `${pagination?.total || 0} universities found`}
        </div>

        {/* Grid */}
        {isLoading ? <PageLoader /> : universities.length === 0 ? (
          <EmptyState title="No universities found" description="Try adjusting your search or filters" />
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {universities.map((uni: any) => (
                <UniversityCard key={uni.id} university={uni} />
              ))}
            </div>
            {pagination && (
              <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
            )}
          </>
        )}
      </div>
    </PublicLayout>
  )
}
