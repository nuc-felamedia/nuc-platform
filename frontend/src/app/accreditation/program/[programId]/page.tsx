// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE: frontend/src/app/accreditation/program/[programId]/page.tsx
// Create the folder: mkdir -p frontend/src/app/accreditation/program/\[programId\]
// ─────────────────────────────────────────────────────────────────────────────
'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import AccreditationTimeline from '@/components/accreditation/AccreditationTimeline'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://nuc-platform-production.up.railway.app'

const STATUS_COLORS: Record<string, string> = {
  FULL:    '#22c55e',
  INTERIM: '#eab308',
  DENIED:  '#ef4444',
  PENDING: '#9ca3af',
}

export default function ProgramHistoryPage() {
  const { programId } = useParams<{ programId: string }>()
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/v1/accreditation/history/${programId}`)
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.data)
        else setError('Program not found')
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false))
  }, [programId])

  if (loading) return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ width: 40, height: 40, border: '3px solid #e5e7eb', borderTopColor: '#1d4ed8', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 12px' }} />
        <div style={{ color: '#6b7280', fontSize: 14 }}>Loading accreditation history...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (error) return (
    <div style={{ maxWidth: 560, margin: '80px auto', textAlign: 'center', padding: '0 20px' }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>⚠️</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: '#111827', marginBottom: 8 }}>{error}</div>
      <Link href="/accreditation" style={{ color: '#1d4ed8', fontSize: 14 }}>← Back to accreditation</Link>
    </div>
  )

  const { program, history, related, stats } = data

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px 80px' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9ca3af', marginBottom: 28 }}>
        <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
        <span>›</span>
        <Link href="/accreditation" style={{ color: '#9ca3af', textDecoration: 'none' }}>Accreditation</Link>
        <span>›</span>
        <Link href={`/universities/${program.university.slug}`} style={{ color: '#9ca3af', textDecoration: 'none' }}>
          {program.university.name}
        </Link>
        <span>›</span>
        <span style={{ color: '#374151' }}>{program.name}</span>
      </div>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          background: '#eff6ff', color: '#1d4ed8', fontSize: 12, fontWeight: 600,
          padding: '4px 12px', borderRadius: 20, marginBottom: 12,
        }}>
          {program.faculty?.name || 'Programme'}
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 800, color: '#111827', lineHeight: 1.2, margin: '0 0 8px' }}>
          {program.name}
        </h1>
        <div style={{ fontSize: 15, color: '#6b7280', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <span>{program.degreeType}</span>
          <span>·</span>
          <Link href={`/universities/${program.university.slug}`} style={{ color: '#1d4ed8', textDecoration: 'none', fontWeight: 500 }}>
            {program.university.name}
          </Link>
          <span>·</span>
          <span>{program.university.state} State</span>
        </div>
      </div>

      {/* Important context banner */}
      <div style={{
        background: '#fefce8', border: '1px solid #fef08a', borderRadius: 12,
        padding: '12px 16px', marginBottom: 28, fontSize: 13, color: '#854d0e',
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <span style={{ fontSize: 16, flexShrink: 0 }}>ℹ️</span>
        <span>
          To verify accreditation at the time you graduated, find your graduation year below.
          Each row shows whether this program was accredited during that NUC exercise.
        </span>
      </div>

      {/* Main timeline */}
      <AccreditationTimeline
        history={history}
        stats={stats}
        programName={program.name}
        universityName={program.university.name}
      />

      {/* Related programs */}
      {related && related.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 14 }}>
            Other programs at {program.university.name}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 10 }}>
            {related.map((rel: any) => {
              const currentStatus = rel.accreditations?.[0]?.status
              const color = currentStatus ? STATUS_COLORS[currentStatus] : '#9ca3af'
              return (
                <Link
                  key={rel.id}
                  href={`/accreditation/program/${rel.id}`}
                  style={{
                    display: 'block', padding: '12px 14px',
                    background: '#fff', border: '1px solid #f1f5f9',
                    borderRadius: 12, textDecoration: 'none',
                    transition: 'border-color .15s',
                  }}
                >
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111827', marginBottom: 4 }}>
                    {rel.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
                    <span style={{ fontSize: 11, color: '#6b7280' }}>
                      {rel.degreeType} · {currentStatus || 'No data'}
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
