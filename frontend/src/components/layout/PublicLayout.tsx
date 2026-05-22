// src/components/layout/PublicLayout.tsx
import Navbar from './Navbar'
import TopBar from './TopBar'
import Footer from './Footer'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <TopBar />
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
