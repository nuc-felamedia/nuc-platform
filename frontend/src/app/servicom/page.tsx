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
          <p><em>To ensure the orderly development of a well coordinated and productive university system that will guarantee quality and relevant education for national development and global competitiveness.</em></p>
          <p>The Federal Ministry of Education has authorized the NUC to achieve its Mission statement through the delivery of the following mandates:</p>
          <ul>
            <li>Approval of courses and programmes</li>
            <li>Determination and maintenance of Minimum Academic Standards</li>
            <li>Monitoring of Universities</li>
            <li>Accreditation of Academic Programmes</li>
            <li>Provision of guidelines and processing of applications for the establishment of private universities</li>
          </ul>

          <h2>Vision</h2>
          <p><em>To be a dynamic regulatory agency acting as a catalyst for positive change and innovation for the delivery of quality university education in Nigeria.</em></p>

          <h2>Strategic Goals</h2>
          <ul>
            <li>The attainment of stable and crisis-free University System</li>
            <li>To work with Nigerian Universities to achieve full accreditation status for at least 80% of the academic programmes</li>
            <li>To initiate and promote proficiency in the use of ICT for service delivery within the Commission and the Nigerian University System</li>
            <li>To upgrade and maintain physical facilities in the Nigerian University System for delivery of quality university education</li>
            <li>To match university graduate output with national manpower needs</li>
            <li>To foster partnership between the Nigerian University System and the Private sector</li>
          </ul>

          <h2>Services Rendered</h2>
          <p>In compliance with SERVICOM principles, the National Universities Commission is committed to providing the following basic services in a <em>timely, fair, honest, effective and transparent manner</em>:</p>
          <ul>
            <li>Assuring quality of academic programmes through regular accreditation in October/November of every year, and publication of results within one month</li>
            <li>Promoting use of ICT in university education through periodic training of staff and students</li>
            <li>Ensuring orderly development of academic programmes through analysis of academic briefs within four weeks of receipt</li>
            <li>Quarterly monitoring and assessment of academic, financial and administrative performance of universities</li>
            <li>Advising the President on creation of new universities when necessary</li>
            <li>Processing applications for establishment of private universities</li>
            <li>Processing matters relating to establishment and renewal of linkages within 72 hours</li>
            <li>Review of University Master Plans within 30 working days</li>
            <li>Processing SIWES submissions within 48 hours of receipt</li>
            <li>Maintaining comprehensive and up-to-date database to support university research</li>
            <li>Making regular contacts with donors and development partners within 72 hours of contacts</li>
            <li>Prompt, efficient and courteous attendance to customers within ten (10) minutes of entry into any department</li>
          </ul>

          <h2>Customer Obligations</h2>
          <p>The successful implementation of the SERVICOM Initiative cannot be achieved without the full support of customers and stakeholders. We invite you to support this cause by:</p>
          <ul>
            <li>Compliance with NUC regulatory measures for the qualitative development of the Nigerian University System</li>
            <li>Judicious management of available resources by concerned University Managements</li>
            <li>Drawing the immediate attention of the Commission's SERVICOM Division to instances of service failure</li>
            <li>Lodging complaints courteously and politely</li>
            <li>Making constructive suggestions for service improvement</li>
          </ul>

          <h2>Performance Targets</h2>
          <p>Our customers are entitled to:</p>
          <ul>
            <li>Prompt, fair and courteous service at all times</li>
            <li>Adequate consultation where necessary</li>
            <li>Adequate and relevant information through effective communications network</li>
            <li>Cordial staff/customer relationship</li>
            <li>Effective complaints procedure and grievance redress mechanism</li>
            <li>Provision for customers with special needs</li>
          </ul>

          <h2>Grievance Redress Mechanism</h2>
          <p>If our services do not meet your expectations, please contact:</p>
          <ul>
            <li>Email: <a href="mailto:servicom@nuc.edu.ng">servicom@nuc.edu.ng</a></li>
            <li>Email: <a href="mailto:nucservicom@gmail.com">nucservicom@gmail.com</a></li>
            <li>Phone: 08033139779</li>
          </ul>
          <p>
            <strong>Address:</strong> Room 506, National Universities Commission (NUC)<br />
            Aja Nwachukwu House, Plot 430, Aguiyi-Ironsi Street<br />
            Maitama District, PMB 237, Garki GPO, Abuja
          </p>

          <h3>Time Span for Handling Grievances</h3>
          <ul>
            <li>Acknowledgement of complaints: Five (5) working days</li>
            <li>Communication of intended action: Five (5) working days</li>
            <li>Resolution: As quickly as circumstances permit</li>
          </ul>

          <h2>Special Needs Provision</h2>
          <p>The Commission is committed to ensuring that universities provide special services to customers with special needs, including:</p>
          <ul>
            <li>Comfortable hostel accommodation for physically challenged students</li>
            <li>Accommodation for foreign students</li>
            <li>Easy accessibility of lecture halls and hostels for physically challenged students and lecturers</li>
            <li>Provision of learning aids for physically challenged students</li>
          </ul>
        </div>

        <div className="mt-10 p-5 bg-brand-50 rounded-2xl border border-brand-100 text-sm text-brand-700">
          For further inquiries, contact:{' '}
          <a href="mailto:servicom@nuc.edu.ng" className="font-medium underline">servicom@nuc.edu.ng</a>{' '}|{' '}
          <a href="mailto:nucservicom@gmail.com" className="font-medium underline">nucservicom@gmail.com</a>{' '}|{' '}
          08033139779
        </div>
      </div>
    </PublicLayout>
  )
}
