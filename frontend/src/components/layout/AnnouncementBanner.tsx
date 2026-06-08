'use client'
import { useEffect, useState } from 'react'
import { X } from 'lucide-react'

const TYPE_STYLES: Record<string, string> = {
  info:    'bg-blue-600 text-white',
  warning: 'bg-amber-500 text-white',
  success: 'bg-green-600 text-white',
}

const TYPE_ICONS: Record<string, string> = {
  info: 'ℹ️', warning: '⚠️', success: '✅',
}

export default function AnnouncementBanner() {
  const [announcement, setAnnouncement] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'https://nuc-platform-production.up.railway.app'}/api/v1/settings/announcement`)
      .then(r => r.json())
      .then(d => { if (d.data) setAnnouncement(d.data) })
      .catch(() => {})
  }, [])

  if (!announcement || dismissed) return null

  return (
    <div className={`${TYPE_STYLES[announcement.type] || TYPE_STYLES.info} px-4 py-2.5`}>
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm font-medium">
          <span>{TYPE_ICONS[announcement.type] || 'ℹ️'}</span>
          <span>{announcement.message}</span>
        </div>
        <button onClick={() => setDismissed(true)} className="shrink-0 opacity-80 hover:opacity-100">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
