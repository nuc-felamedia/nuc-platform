import Link from 'next/link'
import PublicLayout from '@/components/layout/PublicLayout'

export const metadata = { title: 'SERVICOM — National Universities Commission' }

export default function ServicecomPage() {
  return (
    <PublicLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-brand-600">Home</Link><span>›</span>
          <span className="text-gray-600">SERVICOM</span>
        </nav>
        <div className="mb-8">
          <div className="text-xs font-semibold text-brand-600 uppercase tracking-widest mb-3">Service Delivery</div>
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-4">SERVICOM</h1>
          <p className="text-gray-500 leading-relaxed">Integrated Service Charter of the National Universities Commission (NUC)</p>
        </div>
        <div className="prose prose-gray max-w-none">
          <p>This is the integrated Service Charter of the National Universities Commission (NUC). It stipulates the services provided by the primary service windows at the Commission's Secretariat and the standard to which these services are performed within specified timeframes. It also informs our customers of the procedure for registering their complaints in the event of service failure, and expresses our commitment to regular performance review for the maintenance of high working standards and achievement of identified goals.</p>
          <h2>Mission</h2>
          <p>To ensure the orderly development of a well coordinated and productive university system that will guarantee quality and relevant education for national development and global competitiveness.</p>
          <p>The Federal Ministry of Education has authorized the NUC to achieve its Mission statement through the delivery of the following mandates:</p>
          <ul>
            <li>Approval of courses and programmes</li>
            <li>Determination and maintenance of Minimum Academic Standards</li>
            <li>Monitoring of Universities</li>
            <li>Accreditation of Academic Programmes</li>
            <li>Provision of guidelines and processing of applications for the establishment of private universities</li>
          </ul>
          <h2>Vision</h2>
          <p>To be a dynamic regulatory agency acting as a catalyst for positive change and innovation for the delivery of quality university education in Nigeria.</p>
          <h2>Services Rendered</h2>
          <p>In compliance with SERVICOM principles, the National Universities Commission is committed to providing the following basic services to which its customers are entitled, in a timely, fair, honest, effective and transparent manner:</p>
          <ul>
            <li>Assuring quality of academic programmes through regular conduct of accreditation in October/November of every year, and publication of accreditation results within one month</li>
            <li>Promoting use of ICT in the delivery of university education through periodic training of staff and students</li>
            <li>Ensuring orderly and qualitative development of academic programmes through analysis of academic briefs within four weeks of receipt</li>
            <li>Quarterly monitoring and assessment of the academic, financial and administrative performance of universities</li>
            <li>Advising the President on the creation of new universities and other degree-awarding institutions</li>
            <li>Provision of guidelines and processing of applications for the establishment of private universities</li>
            <li>Processing all matters relating to establishment and renewal of linkages and collaboration between universities within 72 hours</li>
            <li>Review of University Master Plans within 30 working days</li>
          </ul>
          <h2>Complaints</h2>
          <p>For complaints about service delivery, please contact the SERVICOM Nodal Officer at the National Universities Commission Secretariat, Plot 430, Aguiyi Ironsi Street, Maitama, Abuja or email <a href="mailto:info@nuc.edu.ng">info@nuc.edu.ng</a>.</p>
        </div>
      </div>
    </PublicLayout>
  )
}
