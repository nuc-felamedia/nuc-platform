'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { universitiesApi } from '@/lib/api'
import { Button, Input, Select, Card, PageLoader } from '@/components/ui'
import toast from 'react-hot-toast'

const STATES = ['Abia','Adamawa','Akwa Ibom','Anambra','Bauchi','Bayelsa','Benue','Borno','Cross River','Delta','Ebonyi','Edo','Ekiti','Enugu','FCT - Abuja','Gombe','Imo','Jigawa','Kaduna','Kano','Katsina','Kebbi','Kogi','Kwara','Lagos','Nasarawa','Niger','Ogun','Ondo','Osun','Oyo','Plateau','Rivers','Sokoto','Taraba','Yobe','Zamfara']

export default function EditUniversityPage() {
  const { id } = useParams()
  const router = useRouter()
  const queryClient = useQueryClient()

  const [form, setForm] = useState({
    name: '', abbreviation: '', type: 'FEDERAL', state: '', city: '',
    website: '', email: '', phone: '', yearEstablished: '',
    vcName: '', studentPop: '', description: '', mission: '', vision: '',
  })

  const { data: university, isLoading } = useQuery({
    queryKey: ['university-edit', id],
    queryFn: async () => {
      const unis = await universitiesApi.getAll({ limit: 300 })
      return unis.data.data.find((u: any) => u.id === id)
    },
  })

  useEffect(() => {
    if (university) {
      setForm({
        name: university.name || '',
        abbreviation: university.abbreviation || '',
        type: university.type || 'FEDERAL',
        state: university.state || '',
        city: university.city || '',
        website: university.website || '',
        email: university.email || '',
        phone: university.phone || '',
        yearEstablished: university.yearEstablished ? String(university.yearEstablished) : '',
        vcName: university.vcName || '',
        studentPop: university.studentPop || '',
        description: university.description || '',
        mission: university.mission || '',
        vision: university.vision || '',
      })
    }
  }, [university])

  const mutation = useMutation({
    mutationFn: (data: any) => universitiesApi.update(id as string, data),
    onSuccess: () => {
      toast.success('University updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-universities'] })
      queryClient.invalidateQueries({ queryKey: ['university-edit', id] })
      router.push('/admin/universities')
    },
    onError: (err: any) => toast.error(err?.response?.data?.message || 'Failed to update university'),
  })

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  if (isLoading) return <PageLoader />

  return (
    <div className="p-6 sm:p-8 max-w-3xl">
      <div className="mb-6">
        <Link href="/admin/universities" className="text-sm text-brand-600 hover:text-brand-700">
          ← Back to universities
        </Link>
      </div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Edit university</h1>
      <p className="text-gray-500 text-sm mb-6">{form.name}</p>

      <div className="space-y-5">
        <Card className="p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Basic information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input label="University name *" placeholder="e.g. University of Lagos" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <Input label="Abbreviation" placeholder="e.g. UNILAG" value={form.abbreviation} onChange={e => set('abbreviation', e.target.value)} />
            <Select label="Type *" value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="FEDERAL">Federal</option>
              <option value="STATE">State</option>
              <option value="PRIVATE">Private</option>
              <option value="TRANSNATIONAL">Transnational</option>
              <option value="DISTANCE_LEARNING">Distance Learning</option>
            </Select>
            <Select label="State *" value={form.state} onChange={e => set('state', e.target.value)}>
              <option value="">Select state...</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </Select>
            <Input label="City" placeholder="e.g. Lagos" value={form.city} onChange={e => set('city', e.target.value)} />
            <Input label="Year established" placeholder="e.g. 1962" type="number" value={form.yearEstablished} onChange={e => set('yearEstablished', e.target.value)} />
            <Input label="Student population" placeholder="e.g. 50,000+" value={form.studentPop} onChange={e => set('studentPop', e.target.value)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Contact & web</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Website" placeholder="https://university.edu.ng" value={form.website} onChange={e => set('website', e.target.value)} />
            <Input label="Email" placeholder="info@university.edu.ng" value={form.email} onChange={e => set('email', e.target.value)} />
            <Input label="Phone" placeholder="+234 ..." value={form.phone} onChange={e => set('phone', e.target.value)} />
            <Input label="Vice-Chancellor name" placeholder="Prof. ..." value={form.vcName} onChange={e => set('vcName', e.target.value)} />
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Description</h2>
          <div className="space-y-4">
            {[
              { label: 'Description', key: 'description', placeholder: 'Brief description of the university...' },
              { label: 'Mission', key: 'mission', placeholder: 'University mission statement...' },
              { label: 'Vision', key: 'vision', placeholder: 'University vision statement...' },
            ].map(({ label, key, placeholder }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>
                <textarea
                  className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 h-24 resize-none"
                  placeholder={placeholder}
                  value={(form as any)[key]}
                  onChange={e => set(key, e.target.value)}
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex gap-3">
          <Button
            onClick={() => mutation.mutate(form)}
            loading={mutation.isPending}
            disabled={!form.name || !form.state}
            size="lg"
          >
            Save changes
          </Button>
          <Button variant="outline" size="lg" onClick={() => router.push('/admin/universities')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
