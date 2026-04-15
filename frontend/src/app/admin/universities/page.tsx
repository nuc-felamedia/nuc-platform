'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { Plus, Edit, Eye } from 'lucide-react'
import { universitiesApi } from '@/lib/api'
import { Button, Input, Select, PageLoader, EmptyState, Pagination, UniversityTypeBadge } from '@/components/ui'
import { getUniversityInitials } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AdminUniversitiesPage() {
  const [q, setQ] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)

  const { data, isLoading } = useQuery({
    queryKey: ['admin-universities', q, type, page],
    queryFn: () => universitiesApi.getAll({ q, type, page, limit: 20 }),
    select: (res) => res.data,
  })

  const universities = data?.data || []
  const pagination = data?.pagination

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Universities</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total universities</p>
        </div>
        <Link href="/admin/universities/new">
          <Button size="md">
            <Plus size={15} /> Add university
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <Input
            placeholder="Search universities..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            className="max-w-xs"
          />
          <Select value={type} onChange={(e) => { setType(e.target.value); setPage(1) }} className="w-40">
            <option value="">All types</option>
            <option value="FEDERAL">Federal</option>
            <option value="STATE">State</option>
            <option value="PRIVATE">Private</option>
          </Select>
        </div>

        {isLoading ? <PageLoader /> : universities.length === 0 ? (
          <EmptyState title="No universities found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">University</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">State</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Programs</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Actions</th>
                </tr>
              </thead>
              <tbody>
                {universities.map((uni: any) => (
                  <tr key={uni.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-xs shrink-0">
                          {getUniversityInitials(uni.name)}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{uni.name}</div>
                          {uni.abbreviation && <div className="text-xs text-gray-400">{uni.abbreviation}</div>}
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      <UniversityTypeBadge type={uni.type} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{uni.state}</td>
                    <td className="px-5 py-3.5 text-gray-500 hidden md:table-cell">{uni.totalPrograms || 0}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <Link href={`/universities/${uni.slug}`} target="_blank">
                          <Button variant="ghost" size="sm"><Eye size={13} /></Button>
                        </Link>
                        <Link href={`/admin/universities/${uni.id}/edit`}>
                          <Button variant="ghost" size="sm"><Edit size={13} /></Button>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pagination && (
        <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
      )}
    </div>
  )
}
