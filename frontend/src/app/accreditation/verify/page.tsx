'use client'
// src/app/accreditation/verify/page.tsx
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { CheckCircle2, XCircle, Clock, AlertCircle, Search } from 'lucide-react'
import PublicLayout from '@/components/layout/PublicLayout'
import { Button, Input, Select, Card } from '@/components/ui'
import { accreditationApi, universitiesApi } from '@/lib/api'
import { cn } from '@/lib/utils'

export default function VerifyPage() {
  const [uniSlug, setUniSlug] = useState('')
  const [programSlug, setProgramSlug] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const { data: unis } = useQuery({
    queryKey: ['universities-list'],
    queryFn: () => universitiesApi.getAll({ limit: 300 }),
    select: (res) => res.data.data,
  })

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['verify', uniSlug, programSlug],
    queryFn: () => accreditationApi.check(uniSlug, programSlug),
    select: (res) => res.data.data,
    enabled: submitted && !!uniSlug && !!programSlug,
    retry: false,
  })

  const statusIcon = {
    FULL: <CheckCircle2 size={48} className="text-green-500" />,
    INTERIM: <Clock size={48} className="text-yellow-500" />,
    DENIED: <XCircle size={48} className="text-red-500" />,
    PENDING: <AlertCircle size={48} className="text-gray-400" />,
  }

  const statusMessage = {
    FULL: { title: 'Fully Accredited', desc: 'This program holds full NUC accreditation and is approved for study.', color: 'bg-green-50 border-green-200' },
    INTERIM: { title: 'Interim Accreditation', desc: 'This program has interim accreditation and is under review by NUC.', color: 'bg-yellow-50 border-yellow-200' },
    DENIED: { title: 'Accreditation Denied', desc: 'This program does not currently hold NUC accreditation.', color: 'bg-red-50 border-red-200' },
    PENDING: { title: 'Pending Assessment', desc: 'This program has not yet been assessed by NUC.', color: 'bg-gray-50 border-gray-200' },
  }

  return (
    <PublicLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center mb-10">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-brand-600" />
          </div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">Verify Accreditation</h1>
          <p className="text-gray-500">Enter a university and program to instantly check its NUC accreditation status</p>
        </div>

        <Card className="p-6 mb-6">
          <div className="space-y-4">
            <Select
              label="University"
              value={uniSlug}
              onChange={(e) => { setUniSlug(e.target.value); setSubmitted(false) }}
            >
              <option value="">Select a university...</option>
              {(unis || []).map((u: any) => (
                <option key={u.id} value={u.slug}>{u.name}</option>
              ))}
            </Select>

            <Input
              label="Program slug"
              placeholder="e.g. computer-science, medicine-and-surgery"
              value={programSlug}
              onChange={(e) => { setProgramSlug(e.target.value); setSubmitted(false) }}
            />

            <Button
              className="w-full"
              size="lg"
              loading={isLoading}
              onClick={() => setSubmitted(true)}
              disabled={!uniSlug || !programSlug}
            >
              Check accreditation status
            </Button>
          </div>
        </Card>

        {/* Result */}
        {submitted && !isLoading && result && (
          <div className={cn('rounded-2xl border-2 p-8 text-center', statusMessage[result.accreditation?.status as keyof typeof statusMessage]?.color || 'bg-gray-50 border-gray-200')}>
            <div className="flex justify-center mb-4">
              {statusIcon[result.accreditation?.status as keyof typeof statusIcon] || <AlertCircle size={48} className="text-gray-400" />}
            </div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">
              {statusMessage[result.accreditation?.status as keyof typeof statusMessage]?.title || 'Not found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {statusMessage[result.accreditation?.status as keyof typeof statusMessage]?.desc}
            </p>

            <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100 text-left">
              {[
                ['University', result.university?.name],
                ['Program', result.program?.name],
                ['Degree type', result.program?.degreeType],
                ['Faculty', result.faculty?.name || '—'],
                ['Status', result.accreditation?.status || 'Not assessed'],
                ['Year assessed', result.accreditation?.year || '—'],
                ['Valid until', result.accreditation?.expiryDate ? new Date(result.accreditation.expiryDate).getFullYear() : '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between px-4 py-3">
                  <span className="text-sm text-gray-500">{label}</span>
                  <span className="text-sm font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {submitted && !isLoading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <XCircle size={36} className="text-red-400 mx-auto mb-3" />
            <h3 className="font-semibold text-red-800 mb-1">Program not found</h3>
            <p className="text-sm text-red-600">No matching program found. Check the spelling and try again.</p>
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
