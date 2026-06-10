'use client'
import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DEFAULT_SLIDES = [
  {
    id: '1',
    image: 'https://www.nuc.edu.ng/wp-content/uploads/2025/06/MNM_3044.jpg',
    title: 'National Universities Commission',
    subtitle: 'Ensuring quality, promoting excellence, and protecting the integrity of Nigerian degrees since 1962.',
    buttonText: 'Explore Universities',
    buttonLink: '/universities',
  },
  {
    id: '2',
    image: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Mrs.-Emerole-scaled.jpg',
    title: 'Accreditation Results',
    subtitle: 'Search and verify accreditation status of any programme in any Nigerian university instantly.',
    buttonText: 'Check Accreditation',
    buttonLink: '/accreditation',
  },
  {
    id: '3',
    image: 'https://www.nuc.edu.ng/wp-content/uploads/2026/01/Dr.-Zachary-Kwanta.jpeg',
    title: 'Approved Programs',
    subtitle: 'Browse all 5,357 NUC-approved academic programmes across 309 Nigerian universities.',
    buttonText: 'Search Programs',
    buttonLink: '/approved-programmes',
  },
]

interface Slide {
  id: string
  image: string
  title: string
  subtitle: string
  buttonText?: string
  buttonLink?: string
}

interface Props {
  slides?: Slide[]
}

export default function HeroCarousel({ slides }: Props) {
  const items = (slides && slides.length > 0) ? slides : DEFAULT_SLIDES
  const [current, setCurrent] = useState(0)
  const [paused, setPaused] = useState(false)

  const next = useCallback(() => setCurrent(c => (c + 1) % items.length), [items.length])
  const prev = useCallback(() => setCurrent(c => (c - 1 + items.length) % items.length), [items.length])

  useEffect(() => {
    if (paused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [paused, next])

  const slide = items[current]

  return (
    <div className="relative w-full overflow-hidden bg-green-950" style={{height: '600px'}}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>

      {items.map((s, i) => (
        <div key={s.id} className="absolute inset-0 transition-opacity duration-700"
          style={{opacity: i === current ? 1 : 0}}>
          <img src={s.image} alt={s.title} className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0" style={{background: 'linear-gradient(to right, rgba(1,50,32,0.92) 0%, rgba(1,50,32,0.7) 50%, transparent 100%)'}} />
        </div>
      ))}

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
            </div>
            <h1 style={{fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 800, color: 'white', lineHeight: 1.15, marginBottom: '16px'}}>
              {slide.title}
            </h1>
            <p style={{color: '#bbf7d0', fontSize: '17px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '540px'}}>
              {slide.subtitle}
            </p>
            <div style={{display: 'flex', gap: '12px', flexWrap: 'wrap'}}>
              {slide.buttonText && slide.buttonLink && (
                <Link href={slide.buttonLink} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '6px',
                  background: 'white', color: '#14532d', fontWeight: 700,
                  padding: '12px 24px', borderRadius: '12px', fontSize: '14px', textDecoration: 'none'
                }}>
                  {slide.buttonText} →
                </Link>
              )}
              <Link href="/accreditation/verify" style={{
                display: 'inline-flex', alignItems: 'center', gap: '6px',
                border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 500,
                padding: '12px 24px', borderRadius: '12px', fontSize: '14px', textDecoration: 'none',
                backdropFilter: 'blur(4px)'
              }}>
                Verify a program
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button onClick={prev} style={{
        position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 20,
        width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
      }}>
        <ChevronLeft size={20} />
      </button>
      <button onClick={next} style={{
        position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 20,
        width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)',
        border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white'
      }}>
        <ChevronRight size={20} />
      </button>

      <div style={{position: 'absolute', bottom: '24px', left: '50%', transform: 'translateX(-50%)', zIndex: 20, display: 'flex', gap: '8px'}}>
        {items.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} style={{
            border: 'none', cursor: 'pointer', borderRadius: '20px', background: 'white',
            opacity: i === current ? 1 : 0.4, transition: 'all 0.3s',
            width: i === current ? '32px' : '8px', height: '8px'
          }} />
        ))}
      </div>
    </div>
  )
}
