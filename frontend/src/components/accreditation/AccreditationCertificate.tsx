'use client'
// frontend/src/components/accreditation/AccreditationCertificate.tsx
// Client-side PDF certificate generation using browser print
// Usage: <AccreditationCertificate program={program} accreditation={currentAcc} />

import { useState } from 'react'

interface Props {
  programId: string
  programName: string
  universityName: string
  universityType?: string
  state?: string
  facultyName?: string
  degreeType?: string
  status: string
  year: number
  expiryYear?: number | null
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  FULL:    { label: 'FULL ACCREDITATION',      color: '#14532d', bg: '#dcfce7', border: '#86efac' },
  INTERIM: { label: 'INTERIM ACCREDITATION',   color: '#713f12', bg: '#fef9c3', border: '#fde047' },
  DENIED:  { label: 'ACCREDITATION DENIED',    color: '#7f1d1d', bg: '#fee2e2', border: '#fca5a5' },
  PENDING: { label: 'PENDING ASSESSMENT',      color: '#374151', bg: '#f3f4f6', border: '#d1d5db' },
}

function generateCertId(programId: string, year: number) {
  const hash = programId.slice(-6).toUpperCase()
  return `NUC-CERT-${year}-${hash}`
}

function CertificateDocument({ data }: { data: Props }) {
  const cfg = STATUS_CONFIG[data.status] || STATUS_CONFIG.PENDING
  const certId = generateCertId(data.programId, data.year)
  const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div id="nuc-certificate" style={{
      width: '210mm',
      minHeight: '297mm',
      background: '#fff',
      fontFamily: 'Georgia, serif',
      position: 'relative',
      padding: '0',
      boxSizing: 'border-box',
      color: '#1a1a1a',
    }}>
      {/* Top brand bar */}
      <div style={{ background: '#0f3460', height: 16, width: '100%' }} />

      {/* Green accent stripe left */}
      <div style={{
        position: 'absolute', left: 0, top: 16, bottom: 16,
        width: 8, background: cfg.color,
      }} />

      {/* Content */}
      <div style={{ padding: '36px 48px 36px 56px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 28, borderBottom: '0.5px solid #e5e7eb', paddingBottom: 24 }}>
          {/* NUC Crest placeholder */}
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: '#0f3460', margin: '0 auto 12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>NUC</span>
          </div>
          <div style={{ fontSize: 13, fontWeight: 'bold', letterSpacing: '0.12em', color: '#0f3460', textTransform: 'uppercase', marginBottom: 3 }}>
            National Universities Commission
          </div>
          <div style={{ fontSize: 11, color: '#6b7280', letterSpacing: '0.06em' }}>
            FEDERAL REPUBLIC OF NIGERIA
          </div>
        </div>

        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontSize: 9, letterSpacing: '0.2em', color: '#6b7280', textTransform: 'uppercase', marginBottom: 8 }}>
            Official Document
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 'normal', color: '#0f3460', margin: '0 0 6px', letterSpacing: '0.02em' }}>
            Accreditation Certificate
          </h1>
          <div style={{ width: 60, height: 2, background: cfg.color, margin: '0 auto' }} />
        </div>

        {/* Status badge */}
        <div style={{
          background: cfg.bg, border: `1.5px solid ${cfg.border}`,
          borderRadius: 8, padding: '12px 24px', textAlign: 'center', margin: '0 auto 28px',
          maxWidth: 360,
        }}>
          <div style={{ fontSize: 14, fontWeight: 'bold', letterSpacing: '0.08em', color: cfg.color }}>
            {cfg.label}
          </div>
        </div>

        {/* Certifying statement */}
        <p style={{
          fontSize: 12, color: '#374151', textAlign: 'center', lineHeight: 1.8,
          margin: '0 auto 28px', maxWidth: 440,
        }}>
          This is to certify that the programme described below has been duly assessed
          by the National Universities Commission and granted the status stated herein,
          in accordance with the powers vested by the Universities (Miscellaneous Provisions) Act.
        </p>

        {/* Details table */}
        <div style={{
          border: '0.5px solid #e5e7eb', borderRadius: 8,
          overflow: 'hidden', marginBottom: 28,
        }}>
          {[
            ['Institution', data.universityName],
            ['Programme', data.programName],
            ['Degree Awarded', data.degreeType || '—'],
            ['Faculty / Discipline', data.facultyName || '—'],
            ['State', data.state ? `${data.state} State` : '—'],
            ['Institution Type', data.universityType ? data.universityType.charAt(0) + data.universityType.slice(1).toLowerCase() : '—'],
            ['Accreditation Status', cfg.label],
            ['Year of Exercise', String(data.year)],
            ['Valid Until', data.expiryYear ? String(data.expiryYear) : 'Not specified'],
          ].map(([label, value], i) => (
            <div key={label} style={{
              display: 'flex', alignItems: 'flex-start',
              background: i % 2 === 0 ? '#f9fafb' : '#fff',
              borderBottom: i < 8 ? '0.5px solid #f1f5f9' : 'none',
            }}>
              <div style={{
                width: '38%', padding: '9px 14px', fontSize: 11,
                fontWeight: 'bold', color: '#6b7280', letterSpacing: '0.04em',
                textTransform: 'uppercase', flexShrink: 0,
              }}>
                {label}
              </div>
              <div style={{
                flex: 1, padding: '9px 14px', fontSize: 12,
                color: '#111827', borderLeft: '0.5px solid #f1f5f9',
                fontFamily: label === 'Accreditation Status' ? 'inherit' : 'Georgia, serif',
                fontWeight: label === 'Accreditation Status' ? 'bold' : 'normal',
              }}>
                {value}
              </div>
            </div>
          ))}
        </div>

        {/* Signatures */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32 }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, borderBottom: '1px solid #9ca3af', marginBottom: 6 }} />
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#374151' }}>Executive Secretary</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>National Universities Commission</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: 160, borderBottom: '1px solid #9ca3af', marginBottom: 6 }} />
            <div style={{ fontSize: 11, fontWeight: 'bold', color: '#374151' }}>Date of Issue</div>
            <div style={{ fontSize: 10, color: '#9ca3af' }}>{today}</div>
          </div>
        </div>

        {/* Certificate ID + verification */}
        <div style={{
          background: '#eff6ff', border: '0.5px solid #bfdbfe',
          borderRadius: 8, padding: '12px 16px', textAlign: 'center',
        }}>
          <div style={{ fontSize: 11, fontWeight: 'bold', color: '#1e40af', marginBottom: 3 }}>
            Certificate ID: {certId}
          </div>
          <div style={{ fontSize: 10, color: '#3b82f6' }}>
            Verify online at: nuc-platform.vercel.app/accreditation/verify
          </div>
        </div>

        {/* Decorative corner marks */}
        <div style={{ position: 'absolute', top: 24, right: 24, width: 24, height: 24, borderTop: `2px solid ${cfg.color}`, borderRight: `2px solid ${cfg.color}` }} />
        <div style={{ position: 'absolute', bottom: 24, right: 24, width: 24, height: 24, borderBottom: `2px solid ${cfg.color}`, borderRight: `2px solid ${cfg.color}` }} />

      </div>

      {/* Bottom bar */}
      <div style={{
        background: '#0f3460', padding: '8px 56px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <span style={{ fontSize: 9, color: '#93c5fd', letterSpacing: '0.06em' }}>
          NATIONAL UNIVERSITIES COMMISSION
        </span>
        <span style={{ fontSize: 9, color: '#93c5fd' }}>
          Plot 430, Aguiyi Ironsi Street, Maitama, Abuja
        </span>
        <span style={{ fontSize: 9, color: '#93c5fd' }}>
          www.nuc.edu.ng
        </span>
      </div>
    </div>
  )
}

export default function AccreditationCertificateButton(props: Props) {
  const [loading, setLoading] = useState(false)

  const handlePrint = () => {
    setLoading(true)

    // Create a hidden iframe and print from it
    const printWindow = window.open('', '_blank', 'width=800,height=1000')
    if (!printWindow) { setLoading(false); return }

    const cfg = STATUS_CONFIG[props.status] || STATUS_CONFIG.PENDING
    const certId = generateCertId(props.programId, props.year)
    const today = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    const rows = [
      ['INSTITUTION', props.universityName],
      ['PROGRAMME', props.programName],
      ['DEGREE AWARDED', props.degreeType || '—'],
      ['FACULTY / DISCIPLINE', props.facultyName || '—'],
      ['STATE', props.state ? `${props.state} State` : '—'],
      ['INSTITUTION TYPE', props.universityType ? props.universityType.charAt(0) + props.universityType.slice(1).toLowerCase() : '—'],
      ['ACCREDITATION STATUS', cfg.label],
      ['YEAR OF EXERCISE', String(props.year)],
      ['VALID UNTIL', props.expiryYear ? String(props.expiryYear) : 'Not specified'],
    ]

    printWindow.document.write(`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>NUC Accreditation Certificate</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Georgia, serif; background: #fff; color: #1a1a1a; }
  @media print {
    body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .no-print { display: none; }
  }
  .page { width: 210mm; min-height: 297mm; position: relative; background: #fff; }
  .top-bar { background: #0f3460; height: 16px; }
  .left-stripe { position: absolute; left: 0; top: 16px; bottom: 16px; width: 8px; background: ${cfg.color}; }
  .content { padding: 36px 48px 36px 56px; }
  .header { text-align: center; margin-bottom: 24px; border-bottom: 0.5px solid #e5e7eb; padding-bottom: 20px; }
  .crest { width: 60px; height: 60px; border-radius: 50%; background: #0f3460; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; }
  .table-row { display: flex; align-items: flex-start; border-bottom: 0.5px solid #f1f5f9; }
  .table-row:last-child { border-bottom: none; }
  .table-label { width: 38%; padding: 9px 14px; font-size: 10px; font-weight: bold; color: #6b7280; letter-spacing: 0.04em; text-transform: uppercase; flex-shrink: 0; }
  .table-value { flex: 1; padding: 9px 14px; font-size: 12px; color: #111827; border-left: 0.5px solid #f1f5f9; }
  .corner-tr { position: absolute; top: 24px; right: 24px; width: 24px; height: 24px; border-top: 2px solid ${cfg.color}; border-right: 2px solid ${cfg.color}; }
  .corner-br { position: absolute; bottom: 24px; right: 24px; width: 24px; height: 24px; border-bottom: 2px solid ${cfg.color}; border-right: 2px solid ${cfg.color}; }
  .bottom-bar { background: #0f3460; padding: 8px 56px; display: flex; justify-content: space-between; }
</style>
</head>
<body>
<div class="page">
  <div class="top-bar"></div>
  <div class="left-stripe"></div>
  <div class="corner-tr"></div>
  <div class="corner-br"></div>

  <div class="content">
    <div class="header">
      <div class="crest"><span style="color:#fff;font-size:20px;font-weight:bold">NUC</span></div>
      <div style="font-size:12px;font-weight:bold;letter-spacing:0.12em;color:#0f3460;text-transform:uppercase;margin-bottom:3px">National Universities Commission</div>
      <div style="font-size:10px;color:#6b7280;letter-spacing:0.06em">FEDERAL REPUBLIC OF NIGERIA</div>
    </div>

    <div style="text-align:center;margin-bottom:20px">
      <div style="font-size:8px;letter-spacing:0.2em;color:#6b7280;text-transform:uppercase;margin-bottom:6px">Official Document</div>
      <h1 style="font-size:24px;font-weight:normal;color:#0f3460;margin:0 0 8px;letter-spacing:0.02em">Accreditation Certificate</h1>
      <div style="width:60px;height:2px;background:${cfg.color};margin:0 auto"></div>
    </div>

    <div style="background:${cfg.bg};border:1.5px solid ${cfg.border};border-radius:8px;padding:12px 24px;text-align:center;margin:0 auto 24px;max-width:360px">
      <div style="font-size:14px;font-weight:bold;letter-spacing:0.08em;color:${cfg.color}">${cfg.label}</div>
    </div>

    <p style="font-size:11px;color:#374151;text-align:center;line-height:1.8;margin:0 auto 24px;max-width:440px">
      This is to certify that the programme described below has been duly assessed
      by the National Universities Commission and granted the status stated herein,
      in accordance with the powers vested by the Universities (Miscellaneous Provisions) Act.
    </p>

    <div style="border:0.5px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:28px">
      ${rows.map(([label, value], i) => `
        <div class="table-row" style="background:${i % 2 === 0 ? '#f9fafb' : '#fff'}">
          <div class="table-label">${label}</div>
          <div class="table-value" style="${label === 'ACCREDITATION STATUS' ? `font-weight:bold;color:${cfg.color}` : ''}">${value}</div>
        </div>
      `).join('')}
    </div>

    <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:28px">
      <div style="text-align:center">
        <div style="width:160px;border-bottom:1px solid #9ca3af;margin-bottom:6px"></div>
        <div style="font-size:11px;font-weight:bold;color:#374151">Executive Secretary</div>
        <div style="font-size:10px;color:#9ca3af">National Universities Commission</div>
      </div>
      <div style="text-align:center">
        <div style="width:160px;border-bottom:1px solid #9ca3af;margin-bottom:6px"></div>
        <div style="font-size:11px;font-weight:bold;color:#374151">Date of Issue</div>
        <div style="font-size:10px;color:#9ca3af">${today}</div>
      </div>
    </div>

    <div style="background:#eff6ff;border:0.5px solid #bfdbfe;border-radius:8px;padding:12px 16px;text-align:center">
      <div style="font-size:11px;font-weight:bold;color:#1e40af;margin-bottom:3px">Certificate ID: ${certId}</div>
      <div style="font-size:10px;color:#3b82f6">Verify online at: nuc-platform.vercel.app/accreditation/verify</div>
    </div>
  </div>

  <div class="bottom-bar">
    <span style="font-size:9px;color:#93c5fd;letter-spacing:0.06em">NATIONAL UNIVERSITIES COMMISSION</span>
    <span style="font-size:9px;color:#93c5fd">Plot 430, Aguiyi Ironsi Street, Maitama, Abuja</span>
    <span style="font-size:9px;color:#93c5fd">www.nuc.edu.ng</span>
  </div>
</div>

<div class="no-print" style="text-align:center;padding:20px">
  <button onclick="window.print()" style="padding:12px 32px;background:#0f3460;color:#fff;border:none;border-radius:8px;font-size:14px;cursor:pointer;margin-right:10px">
    Save as PDF / Print
  </button>
  <button onclick="window.close()" style="padding:12px 32px;background:#f3f4f6;color:#374151;border:none;border-radius:8px;font-size:14px;cursor:pointer">
    Close
  </button>
</div>

<script>
  window.onload = function() {
    setTimeout(function() { window.print(); }, 500);
  }
</script>
</body>
</html>`)

    printWindow.document.close()
    setLoading(false)
  }

  return (
    <button
      onClick={handlePrint}
      disabled={loading}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: loading ? '#93c5fd' : '#1d4ed8',
        color: '#fff', border: 'none', borderRadius: 10,
        padding: '11px 22px', fontSize: 13, fontWeight: 700,
        cursor: loading ? 'not-allowed' : 'pointer', transition: 'background .2s',
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      {loading ? 'Generating...' : 'Download verification certificate'}
    </button>
  )
}
