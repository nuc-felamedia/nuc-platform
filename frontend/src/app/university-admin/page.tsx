'use client'
// frontend/src/app/university-admin/page.tsx
// University self-management portal — each university manages only their own data

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Building2, BookOpen, CheckCircle2, Clock, XCircle, Pencil, Globe, Phone, Mail, Users, BarChart2, ExternalLink, LogOut, Save } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string; icon: any }> = {
  FULL:    { color: '#166534', bg: '#dcfce7', label: 'Full accreditation', icon: CheckCircle2 },
  INTERIM: { color: '#854d0e', bg: '#fef9c3', label: 'Interim',            icon: Clock },
  DENIED:  { color: '#991b1b', bg: '#fee2e2', label: 'Denied',             icon: XCircle },
  PENDING: { color: '#374151', bg: '#f3f4f6', label: 'Pending',            icon: Clock },
}

function Field({ label, value, onChange, placeholder, type = 'text', multiline = false }: any) {
  const base = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit', color: '#111827' }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize: 'vertical' }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />}
    </div>
  )
}

type Tab = 'overview' | 'programs' | 'profile'

export default function UniversityAdminPortal() {
  const { user, logout } = useAuthStore()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('overview')
  const [university, setUniversity] = useState<any>(null)
  const [stats, setStats] = useState<any>(null)
  const [programs, setPrograms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [progSearch, setProgSearch] = useState('')

  // Profile form state
  const [description, setDescription]           = useState('')
  const [website, setWebsite]                   = useState('')
  const [phone, setPhone]                       = useState('')
  const [email, setEmail]                       = useState('')
  const [address, setAddress]                   = useState('')
  const [city, setCity]                         = useState('')
  const [vcName, setVcName]                     = useState('')
  const [studentPopulation, setStudentPopulation] = useState('')
  const [mission, setMission]                   = useState('')
  const [vision, setVision]                     = useState('')

  useEffect(() => {
    if (!user) { router.push('/auth/login?returnTo=/university-admin'); return }
    if (user.role !== 'UNIVERSITY_ADMIN' && user.role !== 'SUPER_ADMIN') {
      router.push('/admin'); return
    }
    load()
  }, [user])

  async function load() {
    setLoading(true)
    try {
      const [uniRes, statsRes, progRes] = await Promise.all([
        api.get('/universities/my'),
        api.get('/universities/my/stats'),
        api.get('/universities/my/programs'),
      ])
      const uni = uniRes.data?.data
      setUniversity(uni)
      setStats(statsRes.data?.data)
      setPrograms(progRes.data?.data || [])

      // Pre-fill form
      setDescription(uni?.description || '')
      setWebsite(uni?.website || '')
      setPhone(uni?.phone || '')
      setEmail(uni?.email || '')
      setAddress(uni?.address || '')
      setCity(uni?.city || '')
      setVcName(uni?.vcName || '')
      setStudentPopulation(uni?.studentPopulation?.toString() || '')
      setMission(uni?.mission || '')
      setVision(uni?.vision || '')
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to load university data')
    } finally { setLoading(false) }
  }

  async function saveProfile() {
    setSaving(true); setError(''); setSaved(false)
    try {
      await api.put('/universities/my', { description, website, phone, email, address, city, vcName, studentPopulation, mission, vision })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      load()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  const filteredPrograms = programs.filter(p =>
    p.name.toLowerCase().includes(progSearch.toLowerCase()) ||
    p.faculty?.name?.toLowerCase().includes(progSearch.toLowerCase())
  )

  if (!user) return null

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error && !university) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 20 }}>
      <Building2 size={48} color="#d1d5db" />
      <div style={{ fontSize: 18, fontWeight: 700, color: '#374151' }}>No university assigned</div>
      <div style={{ fontSize: 14, color: '#9ca3af', textAlign: 'center', maxWidth: 400 }}>
        Your account has not been linked to a university yet. Contact NUC admin to assign your university.
      </div>
      <Link href="/" style={{ color: '#1d4ed8', fontSize: 14 }}>← Back to home</Link>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', display: 'flex' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Sidebar */}
      <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        {/* Logo */}
        <div style={{ padding: '18px 16px', borderBottom: '1px solid #f1f5f9' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: '#1d4ed8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 14 }}>N</span>
            </div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#111827' }}>University Portal</div>
              <div style={{ fontSize: 10, color: '#9ca3af' }}>NUC Platform</div>
            </div>
          </Link>
        </div>

        {/* University name */}
        {university && (
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#eff6ff' }}>
            <div style={{ fontSize: 11, color: '#3b82f6', fontWeight: 600, marginBottom: 2 }}>Managing</div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#1e40af', lineHeight: 1.3 }}>{university.name}</div>
          </div>
        )}

        {/* Nav */}
        <nav style={{ flex: 1, padding: 12 }}>
          {[
            { id: 'overview', label: 'Overview',     icon: BarChart2 },
            { id: 'programs', label: 'Programs',     icon: BookOpen },
            { id: 'profile',  label: 'Edit profile', icon: Pencil },
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id as Tab)}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 12px', borderRadius: 8, border: 'none', textAlign: 'left',
                background: tab === id ? '#eff6ff' : 'transparent',
                color: tab === id ? '#1d4ed8' : '#6b7280',
                fontSize: 13, fontWeight: tab === id ? 600 : 500, cursor: 'pointer',
                marginBottom: 2,
              }}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding: 12, borderTop: '1px solid #f1f5f9' }}>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 8, padding: '0 4px' }}>
            {user.firstName} {user.lastName}
          </div>
          <Link href={`/universities/${university?.slug}`} target="_blank"
            style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 7, color: '#6b7280', fontSize: 12, textDecoration: 'none', marginBottom: 4 }}>
            <ExternalLink size={13} /> View public page
          </Link>
          <button
            onClick={() => { logout(); router.push('/') }}
            style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 6, padding: '7px 10px', borderRadius: 7, border: 'none', background: 'none', color: '#ef4444', fontSize: 12, cursor: 'pointer', textAlign: 'left' }}>
            <LogOut size={13} /> Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, minWidth: 0, padding: 28 }}>

        {/* Overview tab */}
        {tab === 'overview' && university && (
          <div>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>{university.name}</h1>
              <div style={{ fontSize: 13, color: '#6b7280' }}>{university.state} State · {university.type} · Est. {university.yearEstablished}</div>
            </div>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
              {[
                { label: 'Total programs', value: stats?.totalPrograms || 0, color: '#1d4ed8', bg: '#eff6ff', icon: BookOpen },
                { label: 'Fully accredited', value: stats?.fullCount || 0, color: '#16a34a', bg: '#f0fdf4', icon: CheckCircle2 },
                { label: 'Interim', value: stats?.interimCount || 0, color: '#ca8a04', bg: '#fefce8', icon: Clock },
                { label: 'Denied', value: stats?.deniedCount || 0, color: '#dc2626', bg: '#fef2f2', icon: XCircle },
              ].map(s => (
                <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: '16px 18px' }}>
                  <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: s.color, opacity: 0.8, marginTop: 3 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* University info */}
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, padding: 24, marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>University profile</h3>
                <button onClick={() => setTab('profile')}
                  style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', border: '1px solid #e5e7eb', borderRadius: 7, background: '#fff', fontSize: 12, cursor: 'pointer', color: '#6b7280' }}>
                  <Pencil size={12} /> Edit
                </button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {[
                  { label: 'Vice Chancellor', value: university.vcName, icon: Users },
                  { label: 'Website', value: university.website, icon: Globe },
                  { label: 'Email', value: university.email, icon: Mail },
                  { label: 'Phone', value: university.phone, icon: Phone },
                  { label: 'City', value: university.city, icon: Building2 },
                  { label: 'Student population', value: university.studentPopulation?.toLocaleString(), icon: Users },
                ].filter(f => f.value).map(f => (
                  <div key={f.label} style={{ display: 'flex', gap: 10 }}>
                    <f.icon size={14} color="#9ca3af" style={{ marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{f.label}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{f.value}</div>
                    </div>
                  </div>
                ))}
              </div>
              {university.description && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f9fafb' }}>
                  <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>Description</div>
                  <div style={{ fontSize: 13, color: '#374151', lineHeight: 1.6 }}>{university.description}</div>
                </div>
              )}
            </div>

            {/* Recent programs preview */}
            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: '1px solid #f9fafb' }}>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: '#111827', margin: 0 }}>Programs ({programs.length})</h3>
                <button onClick={() => setTab('programs')} style={{ fontSize: 12, color: '#1d4ed8', background: 'none', border: 'none', cursor: 'pointer' }}>View all →</button>
              </div>
              {programs.slice(0, 5).map((p, i) => {
                const acc = p.accreditations?.[0]
                const cfg = acc ? STATUS_CONFIG[acc.status] : null
                return (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: i < 4 ? '1px solid #f9fafb' : 'none' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: '#9ca3af' }}>{p.faculty?.name || '—'} · {p.degreeType}</div>
                    </div>
                    {cfg ? (
                      <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20, background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                    ) : (
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>No data</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Programs tab */}
        {tab === 'programs' && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Programs</h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>All {programs.length} programs at {university?.name}</p>
            </div>

            <input
              type="text"
              placeholder="Search programs or faculty..."
              value={progSearch}
              onChange={e => setProgSearch(e.target.value)}
              style={{ width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: 10, fontSize: 13, outline: 'none', marginBottom: 16, boxSizing: 'border-box' }}
            />

            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '10px 16px', background: '#f9fafb', borderBottom: '1px solid #f1f5f9', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                <div>Program</div>
                <div>Faculty</div>
                <div>Degree</div>
                <div>Status</div>
              </div>

              {filteredPrograms.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No programs match your search</div>
              ) : (
                filteredPrograms.map((p, i) => {
                  const acc = p.accreditations?.[0]
                  const cfg = acc ? STATUS_CONFIG[acc.status] : null
                  return (
                    <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 0, padding: '12px 16px', borderBottom: i < filteredPrograms.length - 1 ? '1px solid #f9fafb' : 'none', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 500, color: '#111827' }}>{p.name}</div>
                        {acc?.expiryDate && <div style={{ fontSize: 11, color: '#9ca3af' }}>Valid until {new Date(acc.expiryDate).getFullYear()}</div>}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{p.faculty?.name || '—'}</div>
                      <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#6b7280' }}>{p.degreeType}</div>
                      <div>
                        {cfg ? (
                          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 20, background: cfg.bg, color: cfg.color }}>
                            {cfg.label}
                          </span>
                        ) : (
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>No data</span>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Profile edit tab */}
        {tab === 'profile' && (
          <div style={{ maxWidth: 620 }}>
            <div style={{ marginBottom: 24 }}>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: '0 0 4px' }}>Edit university profile</h1>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Update your university's public information on the NUC platform</p>
            </div>

            <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Basic information</div>
              <Field label="Vice Chancellor name" value={vcName} onChange={setVcName} placeholder="Prof. John Doe" />
              <Field label="Website" value={website} onChange={setWebsite} placeholder="https://university.edu.ng" type="url" />
              <Field label="Email address" value={email} onChange={setEmail} placeholder="info@university.edu.ng" type="email" />
              <Field label="Phone number" value={phone} onChange={setPhone} placeholder="+234 803 000 0000" />
              <Field label="City" value={city} onChange={setCity} placeholder="e.g. Lagos" />
              <Field label="Physical address" value={address} onChange={setAddress} placeholder="Full postal address..." />
              <Field label="Student population" value={studentPopulation} onChange={setStudentPopulation} placeholder="e.g. 45000" type="number" />

              <div style={{ borderTop: '1px solid #f1f5f9', margin: '20px 0', paddingTop: 20 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#374151', marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.06em' }}>About the university</div>
                <Field label="Description" value={description} onChange={setDescription} placeholder="Brief overview of the university..." multiline />
                <Field label="Mission statement" value={mission} onChange={setMission} placeholder="The university's mission..." multiline />
                <Field label="Vision statement" value={vision} onChange={setVision} placeholder="The university's vision..." multiline />
              </div>

              {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 14 }}>{error}</div>}
              {saved && <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#166534', marginBottom: 14 }}>✅ Profile updated successfully</div>}

              <button
                onClick={saveProfile}
                disabled={saving}
                style={{ display: 'flex', alignItems: 'center', gap: 6, width: '100%', padding: '12px', borderRadius: 10, border: 'none', background: saving ? '#93c5fd' : '#1d4ed8', color: '#fff', fontSize: 14, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', justifyContent: 'center' }}
              >
                <Save size={15} /> {saving ? 'Saving...' : 'Save changes'}
              </button>
            </div>

            <div style={{ marginTop: 16, padding: '12px 16px', background: '#fefce8', border: '1px solid #fef08a', borderRadius: 10, fontSize: 12, color: '#854d0e' }}>
              ℹ️ Changes to your university profile go live immediately on the NUC platform. You cannot change your university name, type, state or year established — contact NUC admin for those changes.
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
