// ─────────────────────────────────────────────────────────────────────────────
// TRISHA MongoDB Connection + Seed Data
// Connect to MongoDB Atlas (free M0 tier) and seed demo data on first run
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose'
import { Scheme, Household, Student, Application, Document, Notification } from '../models/index.js'

export async function connectDB(uri) {
  try {
    await mongoose.connect(uri, { dbName: 'trisha' })
    console.log('[TRISHA DB] Connected to MongoDB Atlas')
    await seedIfEmpty()
  } catch (err) {
    console.error('[TRISHA DB] Connection failed:', err.message)
    process.exit(1)
  }
}

async function seedIfEmpty() {
  const schemeCount = await Scheme.countDocuments()
  if (schemeCount > 0) {
    console.log('[TRISHA DB] Data already seeded. Skipping.')
    return
  }

  console.log('[TRISHA DB] First run detected. Seeding demo data...')

  // ──── Schemes ────
  await Scheme.insertMany([
    {
      _id: 'pre-matric', code: 'MOTA-SCH-01',
      name: 'Pre-Matric Scholarship for ST Students',
      nameHi: 'अनुसूचित जनजाति के छात्रों हेतु प्री-मैट्रिक छात्रवृत्ति',
      shortName: 'Pre-Matric ST', portal: 'NSP',
      portalFullName: 'National Scholarship Portal (scholarships.gov.in)',
      targetGroup: 'Class IX & X ST Students', category: 'School Education',
      fundingRatio: '75:25 (Center:State)',
      amountRange: '₹3,500 – ₹7,000 / academic year',
      deadline: '2026-10-31',
      description: 'Financial assistance to ST students studying in Classes 9 and 10 to prevent dropout.'
    },
    {
      _id: 'post-matric', code: 'MOTA-SCH-02',
      name: 'Post-Matric Scholarship for ST Students',
      nameHi: 'अनुसूचित जनजाति के छात्रों हेतु पोस्ट-मैट्रिक छात्रवृत्ति',
      shortName: 'Post-Matric ST', portal: 'NSP',
      portalFullName: 'National Scholarship Portal (scholarships.gov.in)',
      targetGroup: 'Post-Secondary to Post-Graduate', category: 'Higher Education',
      fundingRatio: 'Centrally Sponsored (Direct DBT)',
      amountRange: '₹3,000 – ₹20,000 / year + Full Fees',
      deadline: '2026-11-30',
      description: 'Flagship scholarship for ST students pursuing post-secondary education.'
    },
    {
      _id: 'top-class', code: 'MOTA-SCH-03',
      name: 'Top Class Education for ST Students',
      nameHi: 'एसटी छात्रों के लिए शीर्ष श्रेणी शिक्षा योजना',
      shortName: 'Top Class ST', portal: 'NSP / SFMP',
      portalFullName: 'National Scholarship Portal / SFMP Canara Bank',
      targetGroup: 'IITs, NITs, IIMs, AIIMS, NLUs', category: 'Premier Higher Education',
      fundingRatio: '100% Central Sector Scheme',
      amountRange: 'Full Tuition + ₹36,000/year living',
      deadline: '2026-10-15',
      description: 'Full support for ST students in premier Indian institutions.'
    },
    {
      _id: 'nfst', code: 'MOTA-SCH-04',
      name: 'National Fellowship for Higher Education of ST Students',
      nameHi: 'एसटी छात्रों की उच्च शिक्षा हेतु राष्ट्रीय फेलोशिप',
      shortName: 'NFST Fellowship', portal: 'SFMP',
      portalFullName: 'Scholarship Fellowship Management Portal (SFMP Canara Bank)',
      targetGroup: 'M.Phil & Ph.D Scholars', category: 'Doctoral Research',
      fundingRatio: '100% Central Sector Scheme',
      amountRange: 'JRF: ₹37,000/mo | SRF: ₹42,000/mo',
      deadline: '2026-12-31',
      description: 'Doctoral fellowship for ST scholars in Indian universities.'
    },
    {
      _id: 'nos', code: 'MOTA-SCH-05',
      name: 'National Overseas Scholarship for ST Candidates',
      nameHi: 'एसटी उम्मीदवारों हेतु राष्ट्रीय विदेश अध्ययन छात्रवृत्ति',
      shortName: 'NOS Overseas', portal: 'NOS Portal',
      portalFullName: 'Standalone National Overseas Scholarship Portal',
      targetGroup: 'QS Top 500 University Scholars', category: 'International Education',
      fundingRatio: '100% Ministry Sponsorship',
      amountRange: 'Full Tuition + Living Allowance',
      deadline: '2027-03-31',
      description: 'Supports ST scholars studying abroad in top-ranked universities.'
    }
  ])

  // ──── Household ────
  await Household.create({
    _id: 'HH-JH-2023-90812',
    rationCard: 'RC-JH-RNC-049811',
    village: 'Khunti Rural Cluster', district: 'Khunti', state: 'Jharkhand',
    headName: 'Soma Munda', tribalGroup: 'Munda', pvtgStatus: false,
    annualIncome: '₹1,85,000 / year'
  })

  // ──── Students ────
  await Student.insertMany([
    {
      _id: 'student_priya', householdId: 'HH-JH-2023-90812',
      name: 'Priya Munda', nameHi: 'प्रिया मुंडा',
      relation: 'Daughter (Eldest)', educationLevel: 'Under-Graduate (College)',
      institution: 'NIT Jamshedpur', academicProgram: 'B.Tech in Computer Science',
      yearOfStudy: '3rd Year', apaarId: 'APAAR-2023-JH-77192',
      aadhaarMasked: 'XXXX-XXXX-4521', nspId: 'JH202324001928',
      isPrimary: true, avatarInitials: 'PM'
    },
    {
      _id: 'student_birsa', householdId: 'HH-JH-2023-90812',
      name: 'Birsa Munda', nameHi: 'बिरसा मुंडा',
      relation: 'Son (Younger Sibling)', educationLevel: 'Secondary School (Class IX)',
      institution: 'EMRS Khunti', academicProgram: 'Class IX - CBSE',
      yearOfStudy: 'Class 9th', apaarId: 'APAAR-2025-JH-11984',
      aadhaarMasked: 'XXXX-XXXX-9014', nspId: 'JH202425008129',
      isPrimary: false, avatarInitials: 'BM'
    },
    {
      _id: 'student_sunita', householdId: 'HH-JH-2023-90812',
      name: 'Sunita Munda', nameHi: 'सुनीता मुंडा',
      relation: 'Daughter (Sister)', educationLevel: 'Post-Graduate (M.Sc)',
      institution: 'Ranchi University', academicProgram: 'M.Sc Tribal Studies & Botany',
      yearOfStudy: 'Final Year', apaarId: 'APAAR-2021-JH-44019',
      aadhaarMasked: 'XXXX-XXXX-7128', nspId: 'JH202122009841',
      isPrimary: false, avatarInitials: 'SM'
    }
  ])

  // ──── Applications ────
  await Application.insertMany([
    {
      _id: 'APP-NSP-2026-PM7891', studentId: 'student_priya', schemeId: 'post-matric',
      portal: 'NSP', appliedDate: '2026-07-28', academicSession: '2026-27',
      sanctionAmount: '₹18,500', status: 'disbursed',
      statusText: 'DBT Funds Disbursed to Student Account', statusType: 'success',
      lastActionDate: '2026-09-12',
      stages: [
        { stageNumber: 1, title: 'DigiLocker Identity & ST Verification', date: '2026-07-28', isDone: true, remarks: 'ST Certificate verified via Jharkhand e-District API' },
        { stageNumber: 2, title: 'NIT Jamshedpur Nodal Verification', date: '2026-08-04', isDone: true, remarks: 'Dean verified attendance & bonafide' },
        { stageNumber: 3, title: 'State Tribal Welfare Dept. Approval', date: '2026-08-18', isDone: true, remarks: 'Jharkhand Tribal Welfare Directorate approved' },
        { stageNumber: 4, title: 'MoTA Ministry Final Sanction', date: '2026-08-30', isDone: true, remarks: 'MoTA Sanction Order MOTA/SCH/2026/092' },
        { stageNumber: 5, title: 'PFMS Direct Benefit Transfer', date: '2026-09-12', isDone: true, remarks: 'PFMS Credit Successful' }
      ],
      dbtDetails: {
        utrNumber: 'RBI2026091298412', bankName: 'State Bank of India (NIT Jamshedpur Branch)',
        accountMasked: 'XXXX-XXXX-8910', amountCredited: '₹18,500',
        creditDate: '12 September 2026', pfmsSanctionId: 'PFMS-MOTA-2026-8912'
      },
      deficiencies: []
    },
    {
      _id: 'APP-SFMP-2026-TC1042', studentId: 'student_priya', schemeId: 'top-class',
      portal: 'SFMP / NSP', appliedDate: '2026-08-15', academicSession: '2026-27',
      sanctionAmount: 'Full Tuition + ₹36,000', status: 'action_required',
      statusText: 'Action Required: Income Certificate Format', statusType: 'warning',
      lastActionDate: '2026-09-20',
      stages: [
        { stageNumber: 1, title: 'DigiLocker Identity & ST Verification', date: '2026-08-15', isDone: true, remarks: 'Verified against State ST registry' },
        { stageNumber: 2, title: 'NIT Jamshedpur Top Class Verification', date: '2026-08-25', isDone: true, remarks: 'Premier Institute confirmed JEE Rank' },
        { stageNumber: 3, title: 'State Tribal Nodal Inspection', date: '2026-09-20', isDone: false, isActive: true, remarks: 'Income certificate format update requested' },
        { stageNumber: 4, title: 'MoTA National Committee Sanction', isDone: false },
        { stageNumber: 5, title: 'PFMS Direct Benefit Transfer', isDone: false }
      ],
      deficiencies: [
        { field: 'Income Certificate', issue: 'Certificate must be in prescribed format with e-District QR code', raisedBy: 'Jharkhand State Nodal Officer', raisedDate: '2026-09-20', severity: 'critical' }
      ]
    },
    {
      _id: 'APP-NSP-2026-PRE5501', studentId: 'student_birsa', schemeId: 'pre-matric',
      portal: 'NSP', appliedDate: '2026-08-01', academicSession: '2026-27',
      sanctionAmount: '₹7,000', status: 'disbursed',
      statusText: 'Disbursed to Guardian Account', statusType: 'success',
      lastActionDate: '2026-09-08',
      stages: [
        { stageNumber: 1, title: 'EMRS School Enrollment Verification', date: '2026-08-01', isDone: true, remarks: 'EMRS Principal approved via NSP' },
        { stageNumber: 2, title: 'District Welfare Officer Clearance', date: '2026-08-14', isDone: true, remarks: 'DWO Khunti certified ST authenticity' },
        { stageNumber: 3, title: 'State Tribal Welfare Directorate', date: '2026-08-25', isDone: true, remarks: 'Approved in Pre-Matric Batch 04' },
        { stageNumber: 4, title: 'MoTA Central Share Release', date: '2026-09-02', isDone: true, remarks: 'MoTA 75% central share credited to State' },
        { stageNumber: 5, title: 'PFMS Aadhaar DBT Remittance', date: '2026-09-08', isDone: true, remarks: 'Credited to Guardian SBI A/c' }
      ],
      dbtDetails: {
        utrNumber: 'SBIN202609088192', bankName: 'State Bank of India (Khunti Main Branch)',
        accountMasked: 'XXXX-XXXX-4491', amountCredited: '₹7,000',
        creditDate: '08 September 2026', pfmsSanctionId: 'PFMS-EMRS-2026-1082'
      },
      deficiencies: []
    }
  ])

  // ──── Documents ────
  await Document.insertMany([
    {
      _id: 'DOC-ST-01', studentId: 'student_priya',
      title: 'Scheduled Tribe Caste Certificate', titleHi: 'अनुसूचित जनजाति प्रमाण पत्र',
      issuer: 'State Tribal Welfare Dept., Govt. of Jharkhand',
      certNumber: 'JH/ST/2023/889104', issueDate: '15 June 2023',
      verified: true, verificationAgency: 'DigiLocker / NeGD',
      qrHash: 'sha256-e91823abf10928cd991', fileSize: '342 KB',
      category: 'Caste & Category', validity: 'Lifetime Valid'
    },
    {
      _id: 'DOC-AADHAAR-02', studentId: 'student_priya',
      title: 'Aadhaar e-KYC Identity Card', titleHi: 'आधार ई-केवाईसी पहचान पत्र',
      issuer: 'UIDAI', certNumber: 'UIDAI-EKYC-901842',
      issueDate: 'Live OTP Verified', verified: true,
      verificationAgency: 'UIDAI Authentication',
      qrHash: 'sha256-44bfa10982312488', fileSize: '198 KB',
      category: 'Identity', validity: 'NPCI DBT Seeded'
    },
    {
      _id: 'DOC-INC-03', studentId: 'student_priya',
      title: 'Annual Income Certificate (FY 2025-26)', titleHi: 'आय प्रमाण पत्र',
      issuer: 'Circle Officer, Tehsil Khunti',
      certNumber: 'JH/INC/2025/110482', issueDate: '24 April 2025',
      verified: true, verificationAgency: 'Jharkhand JharSewa / DigiLocker',
      qrHash: 'sha256-990a182b8812c', fileSize: '412 KB',
      category: 'Income', validity: 'Valid through 31 March 2027'
    }
  ])

  // ──── Notifications ────
  await Notification.insertMany([
    { _id: 'n1', studentId: 'student_priya', title: 'PFMS DBT Remittance Released', body: 'Post-Matric ST allowance ₹18,500 credited to SBI account (UTR: RBI2026091298412).', type: 'success', isRead: false },
    { _id: 'n2', studentId: 'student_priya', title: 'Action Required: Income Certificate', body: 'State Nodal Officer flagged income certificate format for Top Class application.', type: 'warning', isRead: false },
    { _id: 'n3', studentId: 'student_priya', title: 'National Overseas Scholarship Notice', body: 'Round 2 Overseas Scholarship applications open for QS Top 500 universities.', type: 'info', isRead: true }
  ])

  console.log('[TRISHA DB] Demo data seeded successfully.')
}
