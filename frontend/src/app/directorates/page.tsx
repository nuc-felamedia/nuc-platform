'use client'
// frontend/src/app/directorates/page.tsx

import { useEffect, useState } from 'react'
import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import { api } from '@/lib/api'

export default function DirectoratesPage() {
  const [directorates, setDirectorates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    api.get('/directorates').then(res => {
      setDirectorates(res.data?.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const activeDir = selected
    ? directorates.find(d => d.id === selected)
    : directorates[0]

  if (loading) return (
    <PublicLayout>
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, border: '3px solid #e5e7eb', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </PublicLayout>
  )

  return (
    <PublicLayout>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 20px 80px' }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <h1 style={{ fontSize: 32, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
            Directorates
          </h1>
          <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 16px' }}>
            The National Universities Commission is organised into directorates that oversee different aspects of university education in Nigeria.
          </p>
          <Link href="/profile/setup" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: '#eff6ff', color: '#1d4ed8', fontSize: 13, fontWeight: 600,
            padding: '8px 16px', borderRadius: 20, textDecoration: 'none',
            border: '1px solid #bfdbfe',
          }}>
            NUC Staff? Set up your profile →
          </Link>
        </div>

        {directorates.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🏛️</div>
            <div style={{ fontSize: 16, fontWeight: 600, color: '#374151', marginBottom: 8 }}>
              No directorates yet
            </div>
            <div style={{ fontSize: 14 }}>Directorates will appear here once added by admin.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 24, alignItems: 'start' }}>

            {/* Sidebar — directorate list */}
            <div style={{
              background: '#fff', border: '1px solid #f1f5f9',
              borderRadius: 16, overflow: 'hidden', position: 'sticky', top: 20,
            }}>
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #f1f5f9', fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                All directorates
              </div>
              {directorates.map(dir => {
                const staffCount = dir.divisions?.reduce((n: number, d: any) => n + (d.staff?.length || 0), 0) || 0
                const isActive = (selected ? selected === dir.id : directorates[0]?.id === dir.id)
                return (
                  <button
                    key={dir.id}
                    onClick={() => setSelected(dir.id)}
                    style={{
                      width: '100%', padding: '12px 16px', border: 'none', textAlign: 'left',
                      background: isActive ? '#eff6ff' : '#fff', cursor: 'pointer',
                      borderBottom: '1px solid #f9fafb', borderLeft: isActive ? '3px solid #1d4ed8' : '3px solid transparent',
                      transition: 'all .15s',
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: isActive ? 700 : 500, color: isActive ? '#1d4ed8' : '#374151', lineHeight: 1.3 }}>
                      {dir.name}
                    </div>
                    {staffCount > 0 && (
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 3 }}>
                        {staffCount} staff member{staffCount !== 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Main content */}
            {activeDir && (
              <div>
                {/* Directorate header */}
                <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, padding: 24, marginBottom: 20 }}>
                  <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: '0 0 8px' }}>
                    {activeDir.name}
                  </h2>
                  {activeDir.mandate && (
                    <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7, margin: '0 0 16px' }}>
                      {activeDir.mandate}
                    </p>
                  )}
                  {activeDir.directorName && (
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '12px 16px', background: '#f9fafb', borderRadius: 12,
                    }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: '50%',
                        background: '#1d4ed8', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 16, flexShrink: 0,
                      }}>
                        {activeDir.directorName.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#111827' }}>{activeDir.directorName}</div>
                        <div style={{ fontSize: 12, color: '#6b7280' }}>{activeDir.directorTitle || 'Director'}</div>
                        {activeDir.directorEmail && (
                          <a href={`mailto:${activeDir.directorEmail}`} style={{ fontSize: 12, color: '#1d4ed8' }}>
                            {activeDir.directorEmail}
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Divisions + staff */}
                {activeDir.divisions?.length > 0 ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                    {activeDir.divisions.map((division: any) => (
                      <div key={division.id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 16, overflow: 'hidden' }}>
                        <div style={{ padding: '14px 20px', borderBottom: division.staff?.length > 0 ? '1px solid #f9fafb' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{division.name}</div>
                            {division.description && (
                              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{division.description}</div>
                            )}
                          </div>
                          {division.staff?.length > 0 && (
                            <div style={{ fontSize: 11, color: '#9ca3af', background: '#f9fafb', padding: '3px 10px', borderRadius: 20 }}>
                              {division.staff.length} staff
                            </div>
                          )}
                        </div>

                        {division.staff?.length > 0 && (
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 1, background: '#f9fafb' }}>
                            {division.staff.map((member: any) => (
                              <div key={member.id} style={{ background: '#fff', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                                {member.photoUrl ? (
                                  <img src={member.photoUrl} alt={member.name} style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                                ) : (
                                  <div style={{
                                    width: 40, height: 40, borderRadius: '50%', background: '#e0e7ff',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: 14, fontWeight: 700, color: '#4338ca', flexShrink: 0,
                                  }}>
                                    {member.name?.charAt(0) || '?'}
                                  </div>
                                )}
                                <div style={{ minWidth: 0 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', lineHeight: 1.3 }}>{member.name}</div>
                                  {member.title && <div style={{ fontSize: 11, color: '#6b7280', marginTop: 2 }}>{member.title}</div>}
                                  {member.email && (
                                    <a href={`mailto:${member.email}`} style={{ fontSize: 11, color: '#1d4ed8', marginTop: 2, display: 'block' }}>
                                      {member.email}
                                    </a>
                                  )}
                                  {member.linkedin && (
                                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: '#0077b5', marginTop: 2, display: 'block' }}>
                                      LinkedIn
                                    </a>
                                  )}
                                  {member.bio && (
                                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, lineHeight: 1.5 }}>
                                      {member.bio.slice(0, 120)}{member.bio.length > 120 ? '...' : ''}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {(!division.staff || division.staff.length === 0) && (
                          <div style={{ padding: '16px 20px', fontSize: 13, color: '#9ca3af', fontStyle: 'italic' }}>
                            No staff profiles yet —{' '}
                            <Link href="/profile/setup" style={{ color: '#1d4ed8' }}>staff can add their profile here</Link>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#9ca3af', fontSize: 14 }}>
                    No divisions configured for this directorate yet.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </PublicLayout>
  )
}
