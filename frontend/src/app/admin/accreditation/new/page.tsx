'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { accreditationApi, universitiesApi, programsApi } from '@/lib/api'
import { Button, Input, Select, Card, PageLoader } from '@/components/ui'
import toast from 'react-hot-toast'
import { cn } from '@/lib/utils'

const STATUS_INFO: Record<string, { label: string; desc: string; color: string }> = {
  FULL: { label: 'Full accreditation', desc: 'Program meets all NUC minimum academic standards', color: 'bg-green-50 border-green-200 text-green-800' },
  INTERIM: { label: 'Interim accreditation', desc: 'Program partially meets standards — under review', color: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  DENIED: { label: 'Denied', desc: 'Program does not meet NUC minimum standards', color: 'bg-red-50 border-red-200 text-red-800' },
  PENDING: { label: 'Pending', desc: 'Program has applied but not yet been assessed', color: 'bg-gray-50 border-gray-200 text-gray-700' },
  NOT_YET_ACCREDITED: { label: 'Not yet accredited', desc: 'Program has not applied for accreditation', color: 'bg-gray-50 border-gray-200 text-gray-700' },
}

export default function NewAccreditationPage() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const [selectedUni, setSelectedUni] = useState('')
  const [form, setForm] = useState({
    programId: '',
    status: 'FULL',
    year: new Date().getFullYear(),
    expiryDate: '',
    visitDate: '',
    notes: '',
    panelReport: '',
  })

  const { data: universities, isLoading: loadingUnis } = useQuery({
    queryKey: ['universities-list'],
    queryFn: () => universitiesApi.getAll({ limit: 300 }),
    select: (res) => res.data.data,
  })

  const { data: programs, isLoading: loadingProgs } = useQuery({
    queryKey: ['programs-for-uni', selectedUni],
    queryFn: () => programsApi.getAll({ universityId: selectedUni }),
    select: (res) => res.data.data,
    enabled: !!selectedUni,
  })

  const mutation = useMutation({
    mutationFn: (data: any) => accreditationApi.create(data),
    onSuccess: () => {
      toast.success('Accreditation record created successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-accreditation'] })
      router.push('/admin/accreditation')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to create record'),
  })

  const set = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))
  const statusInfo = STATUS_INFO[form.status]

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i)

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/accreditation" className="text-sm text-brand-600 hover:text-brand-700">
          ← Back to accreditation
        </Link>
      </div>

      <h1 className="font-display text-2xl font-bold text-gray-900 mb-1">Add accreditation record</h1>
      <p className="text-gray-500 text-sm mb-8">Record a new NUC accreditation decision for a university program</p>

      <div className="space-y-5">

        {/* Step 1 — Select university */}
        <Card className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">1</div>
            <h2 className="font-semibold text-gray-900">Select university</h2>
          </div>
          {loadingUnis ? <PageLoader /> : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">University *</label>
              <select
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={selectedUni}
                onChange={e => {
                  setSelectedUni(e.target.value)
                  set('programId', '')
                }}
              >
                <option value="">Choose a university...</option>
                {(universities || []).map((u: any) => (
                  <option key={u.id} value={u.id}>
                    {u.name} {u.abbreviation ? `(${u.abbreviation})` : ''} — {u.state}
                  </option>
                ))}
              </select>
            </div>
          )}
        </Card>

        {/* Step 2 — Select program */}
        <Card className={cn('p-6 transition-opacity', !selectedUni && 'opacity-50 pointer-events-none')}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">2</div>
            <h2 className="font-semibold text-gray-900">Select program</h2>
          </div>
          {selectedUni && loadingProgs ? <PageLoader /> : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Program *</label>
              <select
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.programId}
                onChange={e => set('programId', e.target.value)}
                disabled={!selectedUni}
              >
                <option value="">
                  {!selectedUni ? 'Select a university first' : programs?.length === 0 ? 'No programs found for this university' : 'Choose a program...'}
                </option>
                {(programs || []).map((p: any) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.degreeType}
                    {p.accreditations?.[0] ? ` (Currently: ${p.accreditations[0].status})` : ' (Not yet accredited)'}
                  </option>
                ))}
              </select>
              {selectedUni && programs?.length === 0 && (
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
                  No programs found for this university.{' '}
                  <Link href="/admin/programs/new" className="font-semibold underline">
                    Add a program first →
                  </Link>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Step 3 — Accreditation decision */}
        <Card className={cn('p-6 transition-opacity', !form.programId && 'opacity-50 pointer-events-none')}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-brand-600 text-white text-xs font-bold flex items-center justify-center shrink-0">3</div>
            <h2 className="font-semibold text-gray-900">Accreditation decision</h2>
          </div>

          {/* Status selector */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Accreditation status *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(STATUS_INFO).map(([key, info]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => set('status', key)}
                  className={cn(
                    'flex items-start gap-3 p-3 rounded-xl border text-left transition-all',
                    form.status === key
                      ? `${info.color} border-2`
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  )}
                >
                  <div className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5',
                    form.status === key ? 'border-current' : 'border-gray-300'
                  )}>
                    {form.status === key && <div className="w-2 h-2 rounded-full bg-current" />}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{info.label}</div>
                    <div className="text-xs opacity-75 mt-0.5">{info.desc}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Status preview */}
          {statusInfo && (
            <div className={cn('rounded-xl border p-3 mb-4 text-sm font-medium', statusInfo.color)}>
              Selected: {statusInfo.label} — {statusInfo.desc}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Year assessed *</label>
              <select
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                value={form.year}
                onChange={e => set('year', Number(e.target.value))}
              >
                {years.map(y => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>

            <Input
              label="Expiry / maturity date"
              type="date"
              value={form.expiryDate}
              onChange={e => set('expiryDate', e.target.value)}
            />

            <Input
              label="Panel visit date (optional)"
              type="date"
              value={form.visitDate}
              onChange={e => set('visitDate', e.target.value)}
            />

            <Input
              label="Panel report URL (optional)"
              placeholder="https://..."
              value={form.panelReport}
              onChange={e => set('panelReport', e.target.value)}
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
              placeholder="Any additional notes about this accreditation decision, conditions attached, or areas requiring improvement..."
              value={form.notes}
              onChange={e => set('notes', e.target.value)}
            />
          </div>
        </Card>

        {/* Summary before submit */}
        {form.programId && selectedUni && (
          <Card className="p-5 bg-brand-50 border-brand-200">
            <h3 className="font-semibold text-brand-800 text-sm mb-3">Summary — confirm before saving</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['University', universities?.find((u: any) => u.id === selectedUni)?.name],
                ['Program', programs?.find((p: any) => p.id === form.programId)?.name],
                ['Decision', STATUS_INFO[form.status]?.label],
                ['Year', form.year],
                ['Expires', form.expiryDate || 'Not set'],
              ].map(([label, value]) => (
                <div key={label as string} className="flex flex-col">
                  <span className="text-brand-500 text-xs">{label}</span>
                  <span className="text-brand-900 font-medium">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            onClick={() => mutation.mutate(form)}
            loading={mutation.isPending}
            disabled={!form.programId || !form.status}
            size="lg"
          >
            Save accreditation record
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/admin/accreditation')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
