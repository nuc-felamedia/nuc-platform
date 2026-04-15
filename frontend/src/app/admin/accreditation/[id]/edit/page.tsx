'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { accreditationApi } from '@/lib/api'
import { Button, Input, Select, PageLoader, Card, AccreditationBadge } from '@/components/ui'
import toast from 'react-hot-toast'

export default function EditAccreditationPage() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    status: '',
    year: new Date().getFullYear(),
    expiryDate: '',
    notes: '',
    visitDate: '',
  })

  const { data: record, isLoading } = useQuery({
    queryKey: ['accreditation', id],
    queryFn: () => accreditationApi.getOne(id as string),
    select: (res) => res.data.data,
  })

  useEffect(() => {
    if (record) {
      setForm({
        status: record.status || '',
        year: record.year || new Date().getFullYear(),
        expiryDate: record.expiryDate ? new Date(record.expiryDate).toISOString().split('T')[0] : '',
        notes: record.notes || '',
        visitDate: record.visitDate ? new Date(record.visitDate).toISOString().split('T')[0] : '',
      })
    }
  }, [record])

  const updateMutation = useMutation({
    mutationFn: (data: any) => accreditationApi.update(id as string, data),
    onSuccess: () => {
      toast.success('Accreditation record updated')
      queryClient.invalidateQueries({ queryKey: ['admin-accreditation'] })
      router.push('/admin/accreditation')
    },
    onError: () => toast.error('Failed to update record'),
  })

  if (isLoading) return <PageLoader />

  const uni = record?.program?.university
  const prog = record?.program

  return (
    <div className="p-6 sm:p-8 max-w-2xl">
      <div className="mb-6">
        <Link href="/admin/accreditation" className="text-sm text-brand-600 hover:text-brand-700">
          ← Back to accreditation
        </Link>
      </div>

      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Edit accreditation record</h1>

      {record && (
        <Card className="p-5 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-semibold text-gray-900">{prog?.name}</div>
              <div className="text-sm text-gray-500">{uni?.name} · {prog?.degreeType}</div>
            </div>
            <AccreditationBadge status={record.status} />
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="space-y-4">
          <Select
            label="Accreditation status"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="FULL">Full accreditation</option>
            <option value="INTERIM">Interim</option>
            <option value="DENIED">Denied</option>
            <option value="PENDING">Pending</option>
            <option value="NOT_YET_ACCREDITED">Not yet accredited</option>
          </Select>

          <Input
            label="Year assessed"
            type="number"
            value={form.year}
            onChange={(e) => setForm({ ...form, year: Number(e.target.value) })}
          />

          <Input
            label="Expiry date"
            type="date"
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
          />

          <Input
            label="Visit date (optional)"
            type="date"
            value={form.visitDate}
            onChange={(e) => setForm({ ...form, visitDate: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-28 resize-none"
              placeholder="Any notes about this accreditation decision..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => updateMutation.mutate(form)}
              loading={updateMutation.isPending}
            >
              Save changes
            </Button>
            <Button variant="outline" onClick={() => router.push('/admin/accreditation')}>
              Cancel
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
