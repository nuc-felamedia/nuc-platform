import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'
import { ArrowRight, Building2, CheckCircle, FileText, Globe, Users, BookOpen, ChevronRight } from 'lucide-react'
import HeroCarousel from '@/components/layout/HeroCarousel'

async function getHomeData() {
  try {
    const API = process.env.NEXT_PUBLIC_API_URL || 'https://nuc-platform-production.up.railway.app'
    const [statsData, postsData, carouselData] = await Promise.all([
      fetch(`${API}/api/v1/stats`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${API}/api/v1/posts?limit=3&status=PUBLISHED&type=NEWS`, { cache: 'no-store' }).then(r => r.json()),
      fetch(`${API}/api/v1/settings/announcement`, { cache: 'no-store' }).then(r => r.json()).catch(() => ({ data: null })),
    ])
    return {
      stats: statsData.data,
      posts: postsData.data || [],
      carousel: carouselData.data?.carousel_slides ? JSON.parse(carouselData.data.carousel_slides) : [],
    }
  } catch {
    return { stats: null, posts: [], carousel: [] }
  }
}

export default async function HomePage() {
  const { stats, posts, carousel } = await getHomeData()

  const STAT_ITEMS = [
    { label: 'Total Universities', value: stats?.totalUniversities || 309, href: '/universities' },
    { label: 'Federal Universities', value: stats?.federalCount || 74, href: '/universities?type=FEDERAL' },
    { label: 'State Universities', value: stats?.stateCount || 67, href: '/universities?type=STATE' },
    { label: 'Private Universities', value: stats?.privateCount || 168, href: '/universities?type=PRIVATE' },
  ]

  const SERVICES = [
    { title: 'University Directory', desc: 'Browse all 309 NUC-approved universities by type, state and accreditation status.', href: '/universities', icon: Building2, tag: '309 universities' },
    { title: 'Accreditation Results', desc: 'Full searchable database of accreditation records for all programmes.', href: '/accreditation', icon: CheckCircle, tag: 'Searchable database' },
    { title: 'Approved Programs', desc: 'Search all NUC-approved programmes across Nigerian universities.', href: '/approved-programmes', icon: BookOpen, tag: '5,357 programs' },
    { title: 'Bulletins & Circulars', desc: 'Official NUC announcements, press releases and circulars.', href: '/bulletins', icon: FileText, tag: 'Latest news' },
    { title: 'Guidelines & Documents', desc: 'Download official NUC guidelines, statistical digests and policy documents.', href: '/guidelines', icon: Globe, tag: 'Free downloads' },
    { title: 'Directorates', desc: 'Explore NUC departments, divisions, directors and staff.', href: '/directorates', icon: Users, tag: '13 directorates' },
  ]

  return (
    <PublicLayout>
      {/* ── HERO CAROUSEL ── */}
      <HeroCarousel slides={carousel} />

      {/* ── STATS BAR ── */}
      <section style={{background: '#052e16', borderBottom: '1px solid #14532d'}}>
        <div style={{maxWidth: 1200, margin: '0 auto', padding: '0 24px'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)'}}>
            {STAT_ITEMS.map((s, i) => (
              <Link key={s.label} href={s.href} style={{
                display: 'block', padding: '20px 24px', textDecoration: 'none', textAlign: 'center',
                borderRight: i < 3 ? '1px solid #14532d' : 'none',
                transition: 'background 0.2s',
              }}>
                <div style={{fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', lineHeight: 1}}>{s.value.toLocaleString()}</div>
                <div style={{fontSize: 11, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 6, fontWeight: 600}}>{s.label}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── ES SECTION ── */}
      <section style={{background: 'white', borderBottom: '1px solid #f1f5f9', padding: '64px 24px'}}>
        <div style={{maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'row', gap: 56, alignItems: 'center', flexWrap: 'wrap'}}>
          <div style={{flexShrink: 0}}>
            <img src="/es-photo.jpg" alt="Prof. Abdullahi Yusufu Ribadu"
              style={{width: 240, height: 300, objectFit: 'cover', objectPosition: 'top', borderRadius: 20, border: '1px solid #e2e8f0'}} />
          </div>
          <div style={{flex: 1, minWidth: 280}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12}}>Message from the Executive Secretary</div>
            <h2 style={{fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: '#111827', marginBottom: 6, lineHeight: 1.2}}>Prof. Abdullahi Yusufu Ribadu, FCVSN</h2>
            <p style={{fontSize: 14, color: '#16a34a', fontWeight: 600, marginBottom: 20}}>Executive Secretary, National Universities Commission</p>
            <p style={{fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 16}}>
              Born in Fufore, Adamawa State on September 2nd, 1960, Professor Abdullahi Yusufu Ribadu, FCVSN embodies a lifelong dedication to education and a relentless pursuit of excellence. A distinguished veterinary scientist, he holds a DVM from Ahmadu Bello University, a PhD from the University of Liverpool, and a postdoctoral fellowship from Rakuno Gakuen University, Japan.
            </p>
            <p style={{fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 28}}>
              As Executive Secretary of NUC, Professor Ribadu is implementing a seven-point agenda focused on increasing access, enhancing funding, driving digitisation, strengthening quality assurance, promoting innovation and research, stabilising the academic calendar, and revisiting NUC laws.
            </p>
            <Link href="/about/executive-secretary" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              background: '#15803d', color: 'white', fontWeight: 700,
              padding: '12px 24px', borderRadius: 12, fontSize: 14, textDecoration: 'none'
            }}>
              Read full profile →
            </Link>
            <div style={{marginTop: 20, fontSize: 13, color: '#9ca3af'}}>
              Plot 430, Aguiyi Ironsi Street, Maitama District, Abuja, FCT · info@nuc.edu.ng · www.nuc.edu.ng
            </div>
          </div>
        </div>
      </section>

      {/* ── LATEST NEWS ── */}
      {posts.length > 0 && (
        <section style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0', padding: '64px 24px'}}>
          <div style={{maxWidth: 1100, margin: '0 auto'}}>
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 36}}>
              <div>
                <div style={{fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8}}>Stay informed</div>
                <h2 style={{fontSize: 'clamp(22px, 2.5vw, 30px)', fontWeight: 800, color: '#111827'}}>Latest from NUC</h2>
              </div>
              <Link href="/bulletins" style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: '#15803d', fontWeight: 600, textDecoration: 'none'}}>
                View all news <ArrowRight size={16} />
              </Link>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 24}}>
              {posts.map((post: any, i: number) => {
                const thumb = post.featuredImage || (post.content?.match(/src="(https?:\/\/[^"]+\.(jpg|jpeg|png|webp)[^"]*)"/i)?.[1])
                const typeColors: Record<string, string> = {
                  NEWS: '#1d4ed8', BULLETIN: '#15803d', PRESS_RELEASE: '#7c3aed', CIRCULAR: '#c2410c', ANNOUNCEMENT: '#0f766e'
                }
                const typeBg: Record<string, string> = {
                  NEWS: '#eff6ff', BULLETIN: '#f0fdf4', PRESS_RELEASE: '#f5f3ff', CIRCULAR: '#fff7ed', ANNOUNCEMENT: '#f0fdfa'
                }
                return (
                  <Link key={post.id} href={`/bulletins/${post.slug}`} style={{textDecoration: 'none', display: 'flex', flexDirection: 'column', background: 'white', borderRadius: 20, border: '1px solid #e2e8f0', overflow: 'hidden', transition: 'box-shadow 0.2s, border-color 0.2s'}}>
                    <div style={{height: 200, overflow: 'hidden', background: '#f1f5f9', position: 'relative'}}>
                      {thumb ? (
                        <img src={thumb} alt={post.title} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
                      ) : (
                        <div style={{width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0fdf4'}}>
                          <img src="/nuc-logo.png" alt="NUC" style={{height: 60, opacity: 0.15}} />
                        </div>
                      )}
                      <div style={{position: 'absolute', top: 12, right: 12, background: 'white/90', backdropFilter: 'blur(4px)', padding: '2px 8px', borderRadius: 8, fontSize: 11, fontWeight: 600, color: '#374151'}}>
                        {post.publishedAt ? new Date(post.publishedAt).getFullYear() : ''}
                      </div>
                    </div>
                    <div style={{padding: 20, flex: 1, display: 'flex', flexDirection: 'column'}}>
                      <span style={{display: 'inline-block', fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, marginBottom: 12, background: typeBg[post.type] || '#f1f5f9', color: typeColors[post.type] || '#374151'}}>
                        {post.type}
                      </span>
                      <h3 style={{fontSize: 15, fontWeight: 700, color: '#111827', lineHeight: 1.45, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p style={{fontSize: 13, color: '#6b7280', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', flex: 1}}>
                          {post.excerpt}
                        </p>
                      )}
                      <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#15803d', fontWeight: 600, marginTop: 16}}>
                        Read more <ArrowRight size={12} />
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── KEY SERVICES ── */}
      <section style={{background: 'white', borderBottom: '1px solid #f1f5f9', padding: '64px 24px'}}>
        <div style={{maxWidth: 1100, margin: '0 auto'}}>
          <div style={{textAlign: 'center', marginBottom: 48}}>
            <div style={{fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10}}>What we offer</div>
            <h2 style={{fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: '#111827', marginBottom: 12}}>Key Services</h2>
            <p style={{fontSize: 16, color: '#6b7280', maxWidth: 520, margin: '0 auto', lineHeight: 1.7}}>
              Everything you need to navigate Nigerian university education — all in one platform.
            </p>
          </div>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20}}>
            {SERVICES.map(service => {
              const Icon = service.icon
              return (
                <Link key={service.title} href={service.href} style={{
                  display: 'flex', flexDirection: 'column', padding: 24,
                  background: 'white', borderRadius: 20, border: '1.5px solid #e2e8f0',
                  textDecoration: 'none', transition: 'all 0.2s',
                }}>
                  <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16}}>
                    <div style={{width: 44, height: 44, borderRadius: 12, background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                      <Icon size={22} color="#15803d" />
                    </div>
                    <span style={{fontSize: 11, fontWeight: 600, color: '#15803d', background: '#f0fdf4', padding: '3px 10px', borderRadius: 20}}>
                      {service.tag}
                    </span>
                  </div>
                  <h3 style={{fontSize: 17, fontWeight: 700, color: '#111827', marginBottom: 8}}>{service.title}</h3>
                  <p style={{fontSize: 13, color: '#6b7280', lineHeight: 1.65, flex: 1}}>{service.desc}</p>
                  <div style={{display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#15803d', fontWeight: 600, marginTop: 16}}>
                    Learn more <ArrowRight size={13} />
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ACCREDITATION OVERVIEW ── */}
      {stats && (
        <section style={{background: '#052e16', padding: '64px 24px'}}>
          <div style={{maxWidth: 1100, margin: '0 auto'}}>
            <div style={{display: 'flex', flexWrap: 'wrap', gap: 48, alignItems: 'center', justifyContent: 'space-between'}}>
              <div style={{flex: 1, minWidth: 260}}>
                <div style={{fontSize: 11, fontWeight: 700, color: '#86efac', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12}}>Accreditation overview</div>
                <h2 style={{fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, color: 'white', marginBottom: 16}}>
                  {stats.accreditationRate}% of all programs are fully accredited
                </h2>
                <p style={{color: '#86efac', fontSize: 15, marginBottom: 28}}>{(stats.totalPrograms || 0).toLocaleString()} programs assessed across all Nigerian universities</p>
                <Link href="/accreditation" style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#14532d', fontWeight: 700, padding: '12px 24px', borderRadius: 12, fontSize: 14, textDecoration: 'none'}}>
                  View full results →
                </Link>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, flex: 1, minWidth: 260, maxWidth: 420}}>
                {[
                  { label: 'Full Accreditation', value: stats.accreditedPrograms, color: '#4ade80', bg: 'rgba(74,222,128,0.1)' },
                  { label: 'Interim', value: stats.interimPrograms, color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
                  { label: 'Denied', value: stats.deniedPrograms, color: '#f87171', bg: 'rgba(248,113,113,0.1)' },
                  { label: 'Total Programs', value: stats.totalPrograms, color: '#93c5fd', bg: 'rgba(147,197,253,0.1)' },
                ].map(item => (
                  <div key={item.label} style={{background: item.bg, border: `1px solid ${item.color}30`, borderRadius: 16, padding: '20px 16px', textAlign: 'center'}}>
                    <div style={{fontSize: 28, fontWeight: 800, color: item.color}}>{(item.value || 0).toLocaleString()}</div>
                    <div style={{fontSize: 11, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontWeight: 500}}>{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── ABOUT NUC ── */}
      <section style={{background: '#f8fafc', padding: '64px 24px'}}>
        <div style={{maxWidth: 1100, margin: '0 auto'}}>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 48, alignItems: 'center'}}>
            <div>
              <div style={{fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12}}>About NUC</div>
              <h2 style={{fontSize: 'clamp(22px, 2.5vw, 32px)', fontWeight: 800, color: '#111827', marginBottom: 16, lineHeight: 1.3}}>
                Nigeria's foremost higher education regulatory body
              </h2>
              <p style={{fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 16}}>
                The National Universities Commission (NUC) was established in 1962 to advise the Federal Government on the funding needs of universities and ensure quality university education in Nigeria.
              </p>
              <p style={{fontSize: 15, color: '#4b5563', lineHeight: 1.8, marginBottom: 28}}>
                Today, NUC regulates 309 approved universities across Nigeria, ensuring they meet minimum academic standards and protecting the value of Nigerian degrees globally.
              </p>
              <div style={{display: 'flex', gap: 12, flexWrap: 'wrap'}}>
                <Link href="/about" style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: '#15803d', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: 12, fontSize: 14, textDecoration: 'none'}}>
                  About NUC →
                </Link>
                <Link href="/directorates" style={{display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid #d1fae5', color: '#15803d', fontWeight: 600, padding: '12px 24px', borderRadius: 12, fontSize: 14, textDecoration: 'none'}}>
                  Our directorates
                </Link>
              </div>
            </div>
            <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16}}>
              {[
                { value: '1962', label: 'Year established' },
                { value: '309', label: 'Universities regulated' },
                { value: '3,800+', label: 'Programs accredited' },
                { value: '13', label: 'Directorates' },
              ].map(item => (
                <div key={item.label} style={{background: 'white', borderRadius: 20, padding: '28px 20px', textAlign: 'center', border: '1px solid #e2e8f0'}}>
                  <div style={{fontSize: 32, fontWeight: 800, color: '#15803d', marginBottom: 6}}>{item.value}</div>
                  <div style={{fontSize: 12, color: '#6b7280', fontWeight: 500}}>{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{background: '#15803d', padding: '56px 24px'}}>
        <div style={{maxWidth: 700, margin: '0 auto', textAlign: 'center'}}>
          <h2 style={{fontSize: 'clamp(22px, 3vw, 32px)', fontWeight: 800, color: 'white', marginBottom: 12}}>
            Need API access or bulk data?
          </h2>
          <p style={{fontSize: 16, color: '#bbf7d0', marginBottom: 32, lineHeight: 1.7}}>
            Embassies, institutions and researchers can access NUC data programmatically.
          </p>
          <div style={{display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap'}}>
            <Link href="/auth/register" style={{display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', color: '#14532d', fontWeight: 700, padding: '14px 28px', borderRadius: 12, fontSize: 15, textDecoration: 'none'}}>
              Create account
            </Link>
            <Link href="/auth/login" style={{display: 'inline-flex', alignItems: 'center', gap: 8, border: '1.5px solid rgba(255,255,255,0.4)', color: 'white', fontWeight: 600, padding: '14px 28px', borderRadius: 12, fontSize: 15, textDecoration: 'none'}}>
              Sign in
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
