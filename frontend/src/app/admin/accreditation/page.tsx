'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, ChevronDown, ChevronUp, Edit } from 'lucide-react'
import Link from 'next/link'
import { accreditationApi, programsApi } from '@/lib/api'
import { Button, Input, Select, PageLoader, EmptyState, Pagination, AccreditationBadge } from '@/components/ui'
import toast from 'react-hot-toast'

export default function AdminAccreditationPage() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [year, setYear] = useState('')
  const [page, setPage] = useState(1)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ programId: '', status: 'FULL', year: new Date().getFullYear(), expiryDate: '', notes: '' })
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery({
    queryKey: ['admin-accreditation', q, status, year, page],
    queryFn: () => accreditationApi.getAll({ q, status, year, page, limit: 20 }),
    select: (res) => res.data,
  })

  const { data: programs } = useQuery({
    queryKey: ['all-programs'],
    queryFn: () => programsApi.getAll(),
    select: (res) => res.data.data,
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => accreditationApi.create(data),
    onSuccess: () => {
      toast.success('Accreditation record created')
      queryClient.invalidateQueries({ queryKey: ['admin-accreditation'] })
      setShowForm(false)
      setForm({ programId: '', status: 'FULL', year: new Date().getFullYear(), expiryDate: '', notes: '' })
    },
    onError: () => toast.error('Failed to create record'),
  })

  const records = data?.data || []
  const pagination = data?.pagination
  const years = Array.from({ length: 10 }, (_, i) => String(new Date().getFullYear() - i))

  return (
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Accreditation records</h1>
          <p className="text-gray-500 text-sm mt-1">{pagination?.total || 0} total records</p>
        </div>
        <Button size="md" onClick={() => setShowForm(!showForm)}>
          <Plus size={15} /> Add record
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
          <h2 className="font-semibold text-gray-900 mb-4">New accreditation record</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Program</label>
              <select
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.programId}
                onChange={(e) => setForm({ ...form, programId: e.target.value })}
              >
                <option value="">Select a program...</option>
                {(programs || []).map((p: any) => (
                  <option key={p.id} value={p.id}>{p.university?.name} — {p.name} ({p.degreeType})</option>
                ))}
              </select>
            </div>
            <Select
              label="Status"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="FULL">Full accreditation</option>
              <option value="INTERIM">Interim</option>
              <option value="DENIED">Denied</option>
              <option value="PENDING">Pending</option>
            </Select>
            <Input
              label="Year assessed"
              type="number"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
            />
            <Input
              label="Expiry date (optional)"
              type="date"
              value={form.expiryDate}
              onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-20 resize-none"
              placeholder="Any additional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => createMutation.mutate(form)}
              loading={createMutation.isPending}
              disabled={!form.programId}
            >
              Save record
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex gap-3 flex-wrap">
          <Input
            placeholder="Search university or program..."
            value={q}
            onChange={(e) => { setQ(e.target.value); setPage(1) }}
            className="flex-1 min-w-48"
          />
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1) }} className="w-40">
            <option value="">All statuses</option>
            <option value="FULL">Full</option>
            <option value="INTERIM">Interim</option>
            <option value="DENIED">Denied</option>
            <option value="PENDING">Pending</option>
          </Select>
          <Select value={year} onChange={(e) => { setYear(e.target.value); setPage(1) }} className="w-32">
            <option value="">All years</option>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>

        {isLoading ? <PageLoader /> : records.length === 0 ? (
          <EmptyState title="No accreditation records found" description="Add a record using the button above" />
        ) : (
          <div>
            <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wide">
              <div className="col-span-4">University</div>
              <div className="col-span-3">Program</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1">Year</div>
              <div className="col-span-2">Expires</div>
            </div>

            {records.map((record: any) => {
              const isExpanded = expandedId === record.id
              const uni = record.program?.university
              const prog = record.program
              return (
                <div key={record.id} className="border-b border-gray-50 last:border-0">
                  <div
                    className="grid grid-cols-2 sm:grid-cols-12 gap-2 sm:gap-4 px-5 py-3.5 cursor-pointer hover:bg-gray-50 transition-colors items-center"
                    onClick={() => setExpandedId(isExpanded ? null : record.id)}
                  >
                    <div className="col-span-1 sm:col-span-4">
                      <div className="font-semibold text-gray-900 text-sm">{uni?.name}</div>
                      <div className="text-xs text-gray-400">{uni?.state}</div>
                    </div>
                    <div className="col-span-1 sm:col-span-3 text-sm text-gray-700">{prog?.name}</div>
                    <div className="col-span-1 sm:col-span-2">
                      <AccreditationBadge status={record.status} />
                    </div>
                    <div className="hidden sm:block col-span-1 text-sm text-gray-500">{record.year}</div>
                    <div className="hidden sm:flex col-span-2 items-center justify-between text-sm text-gray-500">
                      {record.expiryDate ? new Date(record.expiryDate).getFullYear() : '—'}
                      {isExpanded
                        ? <ChevronUp size={14} className="text-gray-400" />
                        : <ChevronDown size={14} className="text-gray-400" />}
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="bg-gray-50 border-t border-gray-100 px-5 py-4">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                        {[
                          ['Program', prog?.name],
                          ['Status', record.status],
                          ['Year assessed', record.year],
                          ['Expiry', record.expiryDate ? new Date(record.expiryDate).getFullYear() : 'N/A'],
                          ['University', uni?.name],
                          ['Degree', prog?.degreeType],
                          ['Visit date', record.visitDate ? new Date(record.visitDate).toLocaleDateString() : '—'],
                          ['Notes', record.notes || '—'],
                        ].map(([label, value]) => (
                          <div key={label} className="bg-white rounded-xl border border-gray-100 p-3">
                            <div className="text-xs text-gray-400 mb-1">{label}</div>
                            <div className="text-sm font-semibold text-gray-800">{String(value)}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex gap-3">
                        <Link href={`/admin/accreditation/${record.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit size={13} /> Edit record
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {pagination && (
        <Pagination page={page} totalPages={pagination.totalPages} onPage={setPage} />
      )}
    </div>
  )
}
