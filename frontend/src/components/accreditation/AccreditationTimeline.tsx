// ─────────────────────────────────────────────────────────────────────────────
// NEW FILE: frontend/src/components/accreditation/AccreditationTimeline.tsx
// ─────────────────────────────────────────────────────────────────────────────
'use client'

interface TimelineRecord {
  id: string
  status: string
  year: number
  expiryDate?: string | null
  isCurrent: boolean
  notes?: string | null
}

interface Stats {
  total: number
  full: number
  interim: number
  denied: number
  firstYear: number | null
  lastYear: number | null
}

interface Props {
  history: TimelineRecord[]
  stats: Stats
  programName: string
  universityName: string
}

const ALL_YEARS = [1990, 1999, 2002, 2005, 2006, 2007, 2008, 2009, 2010,
  2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024]

const STATUS: Record<string, { bg: string; text: string; border: string; dot: string; label: string; bar: string }> = {
  FULL:    { bg: '#f0fdf4', text: '#166534', border: '#86efac', dot: '#22c55e', label: 'Full accreditation', bar: '#22c55e' },
  INTERIM: { bg: '#fefce8', text: '#854d0e', border: '#fde047', dot: '#eab308', label: 'Interim',            bar: '#eab308' },
  DENIED:  { bg: '#fef2f2', text: '#991b1b', border: '#fca5a5', dot: '#ef4444', label: 'Denied',             bar: '#ef4444' },
  PENDING: { bg: '#f9fafb', text: '#374151', border: '#d1d5db', dot: '#9ca3af', label: 'Pending',            bar: '#9ca3af' },
}

const getStatus = (s: string) => STATUS[s] || STATUS.PENDING

export default function AccreditationTimeline({ history, stats, programName, universityName }: Props) {
  const byYear: Record<number, TimelineRecord> = {}
  history.forEach(h => { byYear[h.year] = h })
  const current = history.find(h => h.isCurrent)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Current status banner */}
      {current && (() => {
        const cfg = getStatus(current.status)
        return (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
            background: cfg.bg, border: `1.5px solid ${cfg.border}`, borderRadius: 16,
          }}>
            <div style={{ width: 14, height: 14, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 700, fontSize: 16, color: cfg.text }}>
                Current status: {cfg.label}
              </div>
              <div style={{ fontSize: 13, color: cfg.text, opacity: 0.75, marginTop: 2 }}>
                Last assessed {current.year}
                {current.expiryDate && ` · Accreditation valid until ${new Date(current.expiryDate).getFullYear()}`}
              </div>
            </div>
          </div>
        )
      })()}

      {/* Stats cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {[
          { label: 'Full accreditation', count: stats.full, color: '#16a34a', bg: '#f0fdf4' },
          { label: 'Interim',            count: stats.interim, color: '#ca8a04', bg: '#fefce8' },
          { label: 'Denied',            count: stats.denied,  color: '#dc2626', bg: '#fef2f2' },
        ].map(s => (
          <div key={s.label} style={{
            background: s.bg, borderRadius: 14, padding: '14px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, lineHeight: 1 }}>{s.count}</div>
            <div style={{ fontSize: 11, fontWeight: 600, color: s.color, marginTop: 4, opacity: 0.8 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Visual bar chart */}
      <div style={{
        background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: '20px 20px 16px',
      }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 16 }}>
          Accreditation status across all {stats.total} exercise years ({stats.firstYear}–{stats.lastYear})
        </div>
        <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, minWidth: 'max-content' }}>
            {ALL_YEARS.map(year => {
              const rec = byYear[year]
              const cfg = rec ? getStatus(rec.status) : null
              return (
                <div key={year} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    width: 28,
                    height: rec ? 56 : 8,
                    background: rec ? cfg!.bar : '#e5e7eb',
                    borderRadius: '4px 4px 2px 2px',
                    opacity: rec ? 1 : 0.4,
                    transition: 'all .2s',
                    position: 'relative',
                  }}
                    title={rec ? `${year}: ${cfg!.label}` : `${year}: Not assessed`}
                  />
                  <span style={{ fontSize: 9, color: '#9ca3af', transform: 'rotate(-30deg)', transformOrigin: 'center', marginTop: 2 }}>
                    {`'${String(year).slice(2)}`}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 16, paddingTop: 14, borderTop: '1px solid #f1f5f9' }}>
          {Object.entries(STATUS).filter(([k]) => k !== 'PENDING').map(([key, cfg]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#6b7280' }}>
              <div style={{ width: 10, height: 10, borderRadius: 2, background: cfg.bar }} />
              {cfg.label}
            </div>
          ))}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#9ca3af' }}>
            <div style={{ width: 10, height: 10, borderRadius: 2, background: '#e5e7eb' }} />
            Not assessed that year
          </div>
        </div>
      </div>

      {/* Year-by-year list */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #f8fafc' }}>
          <div style={{ fontWeight: 700, fontSize: 15, color: '#111827' }}>Year-by-year results</div>
          <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>
            {stats.total} accreditation exercises — sorted newest first
          </div>
        </div>
        {[...history].sort((a, b) => b.year - a.year).map((rec, i) => {
          const cfg = getStatus(rec.status)
          return (
            <div key={rec.id} style={{
              display: 'flex', alignItems: 'center', gap: 16, padding: '14px 20px',
              borderBottom: i < history.length - 1 ? '1px solid #f8fafc' : 'none',
              background: rec.isCurrent ? '#f8fafc' : '#fff',
            }}>
              <div style={{ width: 52, flexShrink: 0 }}>
                <div style={{ fontWeight: 700, fontSize: 15, color: rec.isCurrent ? '#1d4ed8' : '#374151' }}>
                  {rec.year}
                </div>
                {rec.isCurrent && (
                  <div style={{ fontSize: 10, fontWeight: 600, color: '#3b82f6', marginTop: 1 }}>CURRENT</div>
                )}
              </div>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.dot, flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <span style={{
                  display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                  fontSize: 12, fontWeight: 600,
                  background: cfg.bg, color: cfg.text, border: `1px solid ${cfg.border}`,
                }}>
                  {cfg.label}
                </span>
                {rec.notes && (
                  <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{rec.notes}</div>
                )}
              </div>
              {rec.expiryDate && (
                <div style={{ fontSize: 11, color: '#9ca3af', textAlign: 'right', flexShrink: 0 }}>
                  Valid until<br />
                  <span style={{ fontWeight: 600, color: '#6b7280' }}>
                    {new Date(rec.expiryDate).getFullYear()}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Verification CTA */}
      <div style={{
        background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        border: '1px solid #bfdbfe', borderRadius: 16, padding: '18px 20px',
      }}>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#1e40af', marginBottom: 6 }}>
          Need official verification?
        </div>
        <div style={{ fontSize: 13, color: '#1d4ed8', lineHeight: 1.6, marginBottom: 14 }}>
          Download an official NUC verification letter confirming this program's accreditation
          status at any specific year. Accepted by embassies and international employers.
        </div>
        <button
          onClick={() => alert('Verification certificate download coming soon')}
          style={{
            background: '#1d4ed8', color: '#fff', border: 'none',
            padding: '10px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Download verification certificate →
        </button>
      </div>
    </div>
  )
}
