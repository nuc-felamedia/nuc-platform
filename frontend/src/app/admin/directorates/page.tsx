'use client'
// frontend/src/app/admin/directorates/page.tsx
// Full admin management: add/edit directorates, divisions, staff

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Pencil, Trash2, ChevronDown, ChevronRight, Users, X, Check } from 'lucide-react'
import { api } from '@/lib/api'
import { useAuthStore } from '@/lib/store'
import { useRouter } from 'next/navigation'

type Staff = { id: string; name: string; title?: string; email?: string; phone?: string; bio?: string; photoUrl?: string; linkedin?: string; isPublic: boolean; order: number }
type Division = { id: string; name: string; description?: string; order: number; staff: Staff[] }
type Directorate = { id: string; name: string; slug: string; mandate?: string; directorName?: string; directorTitle?: string; directorEmail?: string; order: number; isActive: boolean; divisions: Division[] }

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 16, width: '100%', maxWidth: 520, maxHeight: '90vh', overflow: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #f1f5f9' }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', margin: 0 }}>{title}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af' }}><X size={20} /></button>
        </div>
        <div style={{ padding: 24 }}>{children}</div>
      </div>
    </div>
  )
}

function Field({ label, value, onChange, placeholder, type = 'text', multiline = false }: any) {
  const style = { width: '100%', padding: '10px 12px', border: '1.5px solid #e5e7eb', borderRadius: 8, fontSize: 13, outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 5 }}>{label}</label>
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...style, resize: 'vertical' }} />
        : <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={style} />}
    </div>
  )
}

function SaveBtn({ onClick, loading, label = 'Save' }: any) {
  return (
    <button onClick={onClick} disabled={loading} style={{ background: loading ? '#93c5fd' : '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px', fontSize: 13, fontWeight: 600, cursor: loading ? 'not-allowed' : 'pointer', width: '100%' }}>
      {loading ? 'Saving...' : label}
    </button>
  )
}

export default function AdminDirectoratesPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const [directorates, setDirectorates] = useState<Directorate[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  // Modal states
  const [dirModal, setDirModal]       = useState<Directorate | null | 'new'>(null)
  const [divModal, setDivModal]       = useState<{ division: Division | null; directorateId: string } | null>(null)
  const [staffModal, setStaffModal]   = useState<{ staff: Staff | null; divisionId: string } | null>(null)

  useEffect(() => {
    if (user && !['NUC_STAFF', 'SUPER_ADMIN'].includes(user.role)) router.replace('/admin')
    load()
  }, [user])

  async function load() {
    setLoading(true)
    try {
      const res = await api.get('/directorates/admin/all')
      setDirectorates(res.data?.data || [])
    } catch {
      // fallback to public endpoint
      const res = await api.get('/directorates')
      setDirectorates(res.data?.data || [])
    } finally { setLoading(false) }
  }

  function toggle(id: string) {
    setExpanded(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginBottom: 4 }}>
            <Link href="/admin" style={{ color: '#9ca3af', textDecoration: 'none' }}>Admin</Link> › Directorates
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Directorates</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: '4px 0 0' }}>Manage directorates, divisions and staff profiles</p>
        </div>
        <button
          onClick={() => setDirModal('new')}
          style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 10, padding: '10px 16px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={15} /> Add directorate
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading...</div>
      ) : directorates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>
          <Users size={40} style={{ margin: '0 auto 12px', opacity: 0.3 }} />
          <div style={{ fontSize: 15, fontWeight: 600, color: '#374151', marginBottom: 8 }}>No directorates yet</div>
          <button onClick={() => setDirModal('new')} style={{ background: '#1d4ed8', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 16px', fontSize: 13, cursor: 'pointer' }}>
            Add first directorate
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {directorates.map(dir => (
            <div key={dir.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 14, overflow: 'hidden' }}>
              {/* Directorate header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', cursor: 'pointer' }} onClick={() => toggle(dir.id)}>
                <div style={{ color: '#9ca3af' }}>
                  {expanded.has(dir.id) ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{dir.name}</span>
                    {!dir.isActive && <span style={{ fontSize: 10, background: '#fee2e2', color: '#dc2626', padding: '1px 6px', borderRadius: 10, fontWeight: 600 }}>Inactive</span>}
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>· {dir.divisions?.length || 0} divisions · {dir.divisions?.reduce((n, d) => n + (d.staff?.length || 0), 0)} staff</span>
                  </div>
                  {dir.directorName && <div style={{ fontSize: 12, color: '#6b7280', marginTop: 2 }}>Director: {dir.directorName}</div>}
                </div>
                <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                  <button
                    onClick={() => setDirModal(dir)}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', fontSize: 12, cursor: 'pointer', color: '#6b7280' }}
                  >
                    <Pencil size={12} /> Edit
                  </button>
                  <button
                    onClick={() => setDivModal({ division: null, directorateId: dir.id })}
                    style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '5px 10px', border: '1px solid #bfdbfe', borderRadius: 6, background: '#eff6ff', fontSize: 12, cursor: 'pointer', color: '#1d4ed8' }}
                  >
                    <Plus size={12} /> Division
                  </button>
                </div>
              </div>

              {/* Divisions */}
              {expanded.has(dir.id) && (
                <div style={{ borderTop: '1px solid #f9fafb' }}>
                  {dir.mandate && (
                    <div style={{ padding: '8px 16px 0 44px', fontSize: 12, color: '#9ca3af', fontStyle: 'italic' }}>{dir.mandate}</div>
                  )}
                  {dir.divisions?.length === 0 ? (
                    <div style={{ padding: '12px 44px', fontSize: 12, color: '#9ca3af' }}>No divisions yet — add one above</div>
                  ) : (
                    dir.divisions?.map(div => (
                      <div key={div.id} style={{ borderTop: '1px solid #f9fafb' }}>
                        {/* Division row */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 16px 10px 44px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>{div.name}</div>
                            <div style={{ fontSize: 11, color: '#9ca3af' }}>{div.staff?.length || 0} staff member{div.staff?.length !== 1 ? 's' : ''}</div>
                          </div>
                          <div style={{ display: 'flex', gap: 5 }}>
                            <button onClick={() => setDivModal({ division: div, directorateId: dir.id })}
                              style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: 6, background: '#fff', fontSize: 11, cursor: 'pointer', color: '#6b7280' }}>
                              <Pencil size={11} />
                            </button>
                            <button onClick={() => setStaffModal({ staff: null, divisionId: div.id })}
                              style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '4px 8px', border: '1px solid #bfdbfe', borderRadius: 6, background: '#eff6ff', fontSize: 11, cursor: 'pointer', color: '#1d4ed8' }}>
                              <Plus size={11} /> Staff
                            </button>
                          </div>
                        </div>

                        {/* Staff list */}
                        {div.staff?.length > 0 && (
                          <div style={{ padding: '0 16px 10px 60px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                            {div.staff.map(s => (
                              <div key={s.id} style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#f9fafb', borderRadius: 8, padding: '8px 12px' }}>
                                {s.photoUrl ? (
                                  <img src={s.photoUrl} alt={s.name} style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                ) : (
                                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#4338ca', flexShrink: 0 }}>
                                    {s.name?.charAt(0)}
                                  </div>
                                )}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827' }}>{s.name}</div>
                                  <div style={{ fontSize: 11, color: '#6b7280' }}>{s.title || '—'}{s.email ? ` · ${s.email}` : ''}</div>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                  {!s.isPublic && <span style={{ fontSize: 10, color: '#9ca3af' }}>Hidden</span>}
                                  <button onClick={() => setStaffModal({ staff: s, divisionId: div.id })}
                                    style={{ padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: 5, background: '#fff', fontSize: 11, cursor: 'pointer', color: '#6b7280' }}>
                                    <Pencil size={10} />
                                  </button>
                                  <DeleteStaffBtn id={s.id} onDone={load} />
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Directorate Modal */}
      {dirModal && (
        <DirectorateModal
          directorate={dirModal === 'new' ? null : dirModal}
          onClose={() => setDirModal(null)}
          onSaved={() => { setDirModal(null); load() }}
        />
      )}

      {/* Division Modal */}
      {divModal && (
        <DivisionModal
          division={divModal.division}
          directorateId={divModal.directorateId}
          onClose={() => setDivModal(null)}
          onSaved={() => { setDivModal(null); load() }}
        />
      )}

      {/* Staff Modal */}
      {staffModal && (
        <StaffModal
          staff={staffModal.staff}
          divisionId={staffModal.divisionId}
          onClose={() => setStaffModal(null)}
          onSaved={() => { setStaffModal(null); load() }}
        />
      )}
    </div>
  )
}

function DeleteStaffBtn({ id, onDone }: { id: string; onDone: () => void }) {
  const [confirming, setConfirming] = useState(false)
  if (confirming) return (
    <div style={{ display: 'flex', gap: 3 }}>
      <button onClick={async () => { await api.delete(`/directorates/staff/${id}`); onDone() }}
        style={{ padding: '3px 6px', border: '1px solid #fca5a5', borderRadius: 5, background: '#fee2e2', fontSize: 11, cursor: 'pointer', color: '#dc2626' }}>
        <Check size={10} />
      </button>
      <button onClick={() => setConfirming(false)}
        style={{ padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: 5, background: '#fff', fontSize: 11, cursor: 'pointer', color: '#6b7280' }}>
        <X size={10} />
      </button>
    </div>
  )
  return (
    <button onClick={() => setConfirming(true)}
      style={{ padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: 5, background: '#fff', fontSize: 11, cursor: 'pointer', color: '#9ca3af' }}>
      <Trash2 size={10} />
    </button>
  )
}

function DirectorateModal({ directorate, onClose, onSaved }: { directorate: Directorate | null; onClose: () => void; onSaved: () => void }) {
  const [name, setName]                   = useState(directorate?.name || '')
  const [mandate, setMandate]             = useState(directorate?.mandate || '')
  const [directorName, setDirectorName]   = useState(directorate?.directorName || '')
  const [directorTitle, setDirectorTitle] = useState(directorate?.directorTitle || '')
  const [directorEmail, setDirectorEmail] = useState(directorate?.directorEmail || '')
  const [isActive, setIsActive]           = useState(directorate?.isActive !== false)
  const [saving, setSaving]               = useState(false)
  const [error, setError]                 = useState('')

  async function save() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      const payload = { name, mandate, directorName, directorTitle, directorEmail, isActive }
      if (directorate) {
        await api.put(`/directorates/${directorate.id}`, payload)
      } else {
        await api.post('/directorates', payload)
      }
      onSaved()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <Modal title={directorate ? 'Edit directorate' : 'Add directorate'} onClose={onClose}>
      <Field label="Directorate name *" value={name} onChange={setName} placeholder="e.g. Academic Planning" />
      <Field label="Mandate / description" value={mandate} onChange={setMandate} placeholder="What this directorate is responsible for..." multiline />
      <div style={{ borderTop: '1px solid #f1f5f9', margin: '16px 0', paddingTop: 16 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 12 }}>Director details</div>
        <Field label="Director name" value={directorName} onChange={setDirectorName} placeholder="Prof. John Doe" />
        <Field label="Director title" value={directorTitle} onChange={setDirectorTitle} placeholder="Director of Academic Planning" />
        <Field label="Director email" value={directorEmail} onChange={setDirectorEmail} placeholder="director@nuc.edu.ng" type="email" />
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 8, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Active</div>
        <div onClick={() => setIsActive(!isActive)} style={{ width: 40, height: 22, borderRadius: 11, background: isActive ? '#1d4ed8' : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: isActive ? 21 : 3, transition: 'left .2s' }} />
        </div>
      </div>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{error}</div>}
      <SaveBtn onClick={save} loading={saving} label={directorate ? 'Update directorate' : 'Create directorate'} />
    </Modal>
  )
}

function DivisionModal({ division, directorateId, onClose, onSaved }: { division: Division | null; directorateId: string; onClose: () => void; onSaved: () => void }) {
  const [name, setName]               = useState(division?.name || '')
  const [description, setDescription] = useState(division?.description || '')
  const [saving, setSaving]           = useState(false)
  const [error, setError]             = useState('')

  async function save() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      if (division) {
        await api.put(`/directorates/divisions/${division.id}`, { name, description })
      } else {
        await api.post('/directorates/divisions', { name, description, directorateId })
      }
      onSaved()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <Modal title={division ? 'Edit division' : 'Add division'} onClose={onClose}>
      <Field label="Division name *" value={name} onChange={setName} placeholder="e.g. Undergraduate Accreditation" />
      <Field label="Description" value={description} onChange={setDescription} placeholder="What this division handles..." multiline />
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{error}</div>}
      <SaveBtn onClick={save} loading={saving} label={division ? 'Update division' : 'Create division'} />
    </Modal>
  )
}

function StaffModal({ staff, divisionId, onClose, onSaved }: { staff: Staff | null; divisionId: string; onClose: () => void; onSaved: () => void }) {
  const [name, setName]         = useState(staff?.name || '')
  const [title, setTitle]       = useState(staff?.title || '')
  const [email, setEmail]       = useState(staff?.email || '')
  const [phone, setPhone]       = useState(staff?.phone || '')
  const [bio, setBio]           = useState(staff?.bio || '')
  const [photoUrl, setPhotoUrl] = useState(staff?.photoUrl || '')
  const [linkedin, setLinkedin] = useState(staff?.linkedin || '')
  const [isPublic, setIsPublic] = useState(staff?.isPublic !== false)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  async function save() {
    if (!name.trim()) { setError('Name is required'); return }
    setSaving(true); setError('')
    try {
      const payload = { name, title, email, phone, bio, photoUrl, linkedin, isPublic, divisionId }
      if (staff) {
        await api.put(`/directorates/staff/${staff.id}`, payload)
      } else {
        await api.post('/directorates/staff', payload)
      }
      onSaved()
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to save')
    } finally { setSaving(false) }
  }

  return (
    <Modal title={staff ? 'Edit staff member' : 'Add staff member'} onClose={onClose}>
      <Field label="Full name *" value={name} onChange={setName} placeholder="e.g. Dr. Amaka Okafor" />
      <Field label="Job title" value={title} onChange={setTitle} placeholder="e.g. Deputy Director" />
      <Field label="Email" value={email} onChange={setEmail} placeholder="staff@nuc.edu.ng" type="email" />
      <Field label="Phone" value={phone} onChange={setPhone} placeholder="+234 803 000 0000" />
      <Field label="Photo URL" value={photoUrl} onChange={setPhotoUrl} placeholder="https://..." />
      <Field label="LinkedIn URL" value={linkedin} onChange={setLinkedin} placeholder="https://linkedin.com/in/..." />
      <Field label="Short bio" value={bio} onChange={setBio} placeholder="Brief background and role description..." multiline />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f9fafb', borderRadius: 8, marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#374151' }}>Show publicly</div>
          <div style={{ fontSize: 11, color: '#9ca3af' }}>Appears on the public directorates page</div>
        </div>
        <div onClick={() => setIsPublic(!isPublic)} style={{ width: 40, height: 22, borderRadius: 11, background: isPublic ? '#1d4ed8' : '#d1d5db', cursor: 'pointer', position: 'relative', transition: 'background .2s' }}>
          <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: isPublic ? 21 : 3, transition: 'left .2s' }} />
        </div>
      </div>
      {error && <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 12 }}>{error}</div>}
      <SaveBtn onClick={save} loading={saving} label={staff ? 'Update staff member' : 'Add staff member'} />
    </Modal>
  )
}
