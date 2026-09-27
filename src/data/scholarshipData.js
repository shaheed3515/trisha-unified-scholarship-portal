// ─────────────────────────────────────────────────────────────────────────────
// TRISHA DATA LAYER: All 5 MoTA Schemes, Portals, Deduplication, & Households
// ─────────────────────────────────────────────────────────────────────────────

export const SCHEMES = [
  {
    id: 'pre-matric',
    code: 'MOTA-SCH-01',
    name: 'Pre-Matric Scholarship for ST Students',
    nameHi: 'अनुसूचित जनजाति के छात्रों हेतु प्री-मैट्रिक छात्रवृत्ति',
    shortName: 'Pre-Matric ST',
    portal: 'NSP',
    portalFullName: 'National Scholarship Portal (scholarships.gov.in)',
    targetGroup: 'Class IX & X ST Students',
    category: 'School Education',
    fundingRatio: '75:25 (Center:State)',
    disbursementFreq: 'Annual (Direct Benefit Transfer)',
    amountRange: '₹3,500 – ₹7,000 / academic year',
    hostellerAllowance: '₹700 / month (10 months)',
    dayScholarAllowance: '₹225 / month (10 months)',
    bookGrant: '₹1,000 / year',
    deadline: '2026-10-31',
    description: 'Centrally sponsored scheme to support ST parents in sending wards to Class IX and X, actively minimizing tribal dropout rates before board examinations.',
    eligibilityCriteria: [
      'Belongs to Scheduled Tribe (ST) community confirmed via State digital caste portal',
      'Regular full-time student in Class IX or X in a recognized Government / Aided / EMRS school',
      'Total annual family parental income must not exceed ₹2.50 Lakhs per annum',
      'Student must not be holding any other Government scholarship for the same academic level'
    ],
    mandatoryDocuments: [
      { id: 'st_cert', name: 'Digital ST Caste Certificate', source: 'DigiLocker / State e-District' },
      { id: 'income_cert', name: 'Competent Authority Income Certificate', source: 'DigiLocker / Revenue Dept.' },
      { id: 'aadhaar_doc', name: 'Aadhaar Card (Aadhaar Seeding with NPCI Bank)', source: 'UIDAI' },
      { id: 'school_bonafide', name: 'School Admission Bonafide & Previous Class Marksheet', source: 'UDISE+ / School' },
      { id: 'bank_doc', name: 'Aadhaar-Linked Bank Account Details', source: 'PFMS Validated' }
    ],
    faqs: [
      { q: 'Are Eklavya Model Residential School (EMRS) students eligible?', a: 'Yes, EMRS day scholars and hostellers are automatically mapped through the unified tribal registry.' },
      { q: 'Can a student with two siblings also receive this benefit?', a: 'Yes, all eligible children in an ST family can receive pre-matric benefits without individual family caps.' }
    ]
  },
  {
    id: 'post-matric',
    code: 'MOTA-SCH-02',
    name: 'Post-Matric Scholarship for ST Students',
    nameHi: 'अनुसूचित जनजाति के छात्रों हेतु पोस्ट-मैट्रिक छात्रवृत्ति',
    shortName: 'Post-Matric ST',
    portal: 'NSP',
    portalFullName: 'National Scholarship Portal (scholarships.gov.in)',
    targetGroup: 'Post-Secondary, Diploma, Under-Graduate & Post-Graduate',
    category: 'Higher Secondary & College',
    fundingRatio: 'Centrally Sponsored (Direct DBT to Student & Institution)',
    disbursementFreq: 'Semester-wise / Annual',
    amountRange: '₹3,000 – ₹20,000 / year + Full Compulsory Non-Refundable Fees',
    hostellerAllowance: 'Up to ₹1,200 / month',
    dayScholarAllowance: 'Up to ₹550 / month',
    bookGrant: 'Full textbook & study tour reimbursement',
    deadline: '2026-11-30',
    description: 'Flagship umbrella scholarship assisting ST students pursuing recognized post-secondary education through degrees, professional diplomas, and vocational qualifications.',
    eligibilityCriteria: [
      'Applicant must belong to recognized Scheduled Tribe notified for the respective State/UT',
      'Completed Class X (Matriculation) from a recognized Board of Secondary Education',
      'Annual parental/family income from all sources must not exceed ₹2.50 Lakhs',
      'Course must be approved under Group I, II, III, or IV of MoTA revised scholarship guidelines'
    ],
    mandatoryDocuments: [
      { id: 'st_cert', name: 'Digital ST Certificate with QR Code', source: 'DigiLocker' },
      { id: 'income_cert', name: 'Income Certificate (< ₹2.5 Lakhs)', source: 'DigiLocker' },
      { id: 'aadhaar_doc', name: 'Aadhaar Biometric e-KYC', source: 'UIDAI' },
      { id: 'marksheet_12', name: 'Class XII / Graduation Marksheet', source: 'DigiLocker' },
      { id: 'fee_receipt', name: 'Institutional Fee Receipt & Bonafide Certificate', source: 'AISHE Institute' }
    ],
    faqs: [
      { q: 'Is fee paid directly to the institute or student?', a: 'As per DBT 2.0 norms, non-refundable tuition fees are directly remitted to verified AISHE institutions, while maintenance allowances go to the student Aadhaar-seeded bank account.' }
    ]
  },
  {
    id: 'top-class',
    code: 'MOTA-SCH-03',
    name: 'Top Class Education for ST Students',
    nameHi: 'एसटी छात्रों के लिए शीर्ष श्रेणी शिक्षा योजना',
    shortName: 'Top Class ST',
    portal: 'NSP / SFMP',
    portalFullName: 'National Scholarship Portal / SFMP Canara Bank',
    targetGroup: 'Students admitted to Premier Institutions (IITs, NITs, IIMs, AIIMS, NLUs, etc.)',
    category: 'Premier Higher Education',
    fundingRatio: '100% Central Sector Scheme',
    disbursementFreq: 'Direct Institution + DBT Living Grant',
    amountRange: 'Full Tuition Fee + ₹36,000/year living allowance + ₹45,000 hardware grant',
    hostellerAllowance: '₹3,000 / month living expenses',
    dayScholarAllowance: '₹3,000 / month',
    bookGrant: '₹5,000 / year books & stationery + ₹45,000 one-time computer grant',
    deadline: '2026-10-15',
    description: 'Empowers meritorious ST students securing admission in notified premier Indian institutions (IITs, NITs, IIMs, IISc, National Law Universities, and Central Institutes).',
    eligibilityCriteria: [
      'Gained confirmed admission into one of the 250+ MoTA-notified Top Class institutions',
      'Family income ceiling from all sources is ₹6.00 Lakhs per annum (relaxed from ₹2.5L)',
      'Fresh awards capped at 1,000 slots nationally per financial year on strict merit ranking'
    ],
    mandatoryDocuments: [
      { id: 'jee_neet_rank', name: 'All India Entrance Examination Scorecard & Rank Card', source: 'NTA / JoSAA' },
      { id: 'st_cert', name: 'ST Verification Certificate', source: 'DigiLocker' },
      { id: 'inst_admission', name: 'Premier Institution Allotment & Admission Letter', source: 'Institute' },
      { id: 'income_cert', name: 'Income Certificate (< ₹6.00 Lakhs)', source: 'Revenue Authority' }
    ],
    faqs: [
      { q: 'Can I claim Top Class if I previously received Post-Matric?', a: 'Yes, but once Top Class is sanctioned, your Post-Matric allocation is automatically cancelled to prevent duplication.' }
    ]
  },
  {
    id: 'nfst',
    code: 'MOTA-SCH-04',
    name: 'National Fellowship for Higher Education of ST Students',
    nameHi: 'एसटी छात्रों की उच्च शिक्षा हेतु राष्ट्रीय फेलोशिप (NFST)',
    shortName: 'NFST Fellowship',
    portal: 'SFMP',
    portalFullName: 'Scholarship Fellowship Management Portal (SFMP Canara Bank)',
    targetGroup: 'M.Phil & Ph.D Tribal Research Scholars',
    category: 'Doctoral Research',
    fundingRatio: '100% Central Sector Scheme',
    disbursementFreq: 'Monthly DBT via Canara Bank Nodal Gateway',
    amountRange: 'JRF: ₹37,000/mo | SRF: ₹42,000/mo + Contingency + HRA',
    hostellerAllowance: 'HRA as per 8%, 16%, or 24% City tier classification',
    dayScholarAllowance: 'Applicable institutional fellowship guidelines',
    bookGrant: 'Contingency ₹20,500/year (Sciences) | ₹12,000/year (Humanities)',
    deadline: '2026-12-31',
    description: 'Prestigious fellowship granting 750 fresh doctoral slots every year for ST scholars pursuing full-time Ph.D degrees across Indian Universities approved by UGC/CSIR.',
    eligibilityCriteria: [
      'Scheduled Tribe candidate registered for regular, full-time M.Phil or Ph.D degree',
      'Qualified UGC-NET, CSIR-NET, or University Research Entrance Exam',
      'No income ceiling limit applies for NFST',
      'Cannot be in concurrent paid employment or availing ICMR, CSIR, or ICSSR doctoral fellowship'
    ],
    mandatoryDocuments: [
      { id: 'phd_reg', name: 'Ph.D University Registration / Confirmation Letter', source: 'University Registrar' },
      { id: 'guide_consent', name: 'Research Guide / Supervisor Consent Certificate', source: 'University Dept.' },
      { id: 'synopsis_doc', name: 'Approved Doctoral Research Synopsis / Proposal', source: 'Research Advisory' },
      { id: 'st_cert', name: 'Digital ST Certificate', source: 'DigiLocker' }
    ],
    faqs: [
      { q: 'How is monthly fellowship paid?', a: 'Monthly scholar continuation certificates are signed digitally by the university guide on SFMP, releasing monthly DBT directly to the scholar.' }
    ]
  },
  {
    id: 'nos',
    code: 'MOTA-SCH-05',
    name: 'National Overseas Scholarship for ST Candidates',
    nameHi: 'एसटी उम्मीदवारों हेतु राष्ट्रीय विदेश अध्ययन छात्रवृत्ति (NOS)',
    shortName: 'NOS Overseas',
    portal: 'NOS Portal',
    portalFullName: 'Standalone National Overseas Scholarship Portal (nosmsje.gov.in / mota.gov.in)',
    targetGroup: 'Master’s & Ph.D Scholars heading to Top 500 QS World Ranking Universities',
    category: 'International Higher Education',
    fundingRatio: '100% Ministry Direct Sponsorship',
    disbursementFreq: 'Annual Tuition to Foreign University + Monthly Maintenance',
    amountRange: 'US $15,400/yr (USA) | £9,900/yr (UK) + Full Tuition + Health Insurance + Flights',
    hostellerAllowance: 'Full International Living Allowance + Contingency $1,500/yr',
    dayScholarAllowance: 'Covers VISA fees, return economy airfare, and emergency medical covers',
    bookGrant: 'Full international equipment and academic allowances included',
    deadline: '2027-03-31',
    description: 'Supports high-achieving ST scholars to study abroad in QS Top 500 universities in Engineering, Technology, Medicine, Pure Sciences, and Agriculture.',
    eligibilityCriteria: [
      'ST candidate with unconditional admission offer from QS World University Rankings Top 500',
      'Minimum 55% marks or equivalent grade in Bachelor’s / Master’s qualifying degree',
      'Total family income from all sources should not exceed ₹6.00 Lakhs per annum',
      'Candidate age must be below 35 years as on the first day of application year'
    ],
    mandatoryDocuments: [
      { id: 'offer_letter', name: 'Unconditional Admission Letter from Foreign University', source: 'Admissions Office' },
      { id: 'passport_doc', name: 'Valid Indian Passport Copy (Min 2 years validity)', source: 'Passport Seva' },
      { id: 'qs_ranking', name: 'Official Proof of University QS World Ranking (< 500)', source: 'QS Ranking Authority' },
      { id: 'st_cert', name: 'ST Digital Verification Certificate', source: 'DigiLocker' },
      { id: 'visa_affidavit', name: 'Declaration / Bond for Return Service to India', source: 'Notarized Legal' }
    ],
    faqs: [
      { q: 'Can I apply before receiving the foreign visa?', a: 'Yes. MoTA issues a formal Sanction Letter which you submit to the foreign embassy for visa facilitation.' }
    ]
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// FAMILY & MULTI-SIBLING HOUSEHOLD MODEL (Addressed to MoTA Pain Point)
// ─────────────────────────────────────────────────────────────────────────────

export const HOUSEHOLD_DATA = {
  householdId: 'HH-JH-2023-90812',
  rationCardNumber: 'RC-JH-RNC-049811',
  village: 'Khunti Rural Cluster',
  district: 'Khunti (Tribal Aspirational District)',
  state: 'Jharkhand',
  headOfHousehold: 'Soma Munda',
  relation: 'Father / Guardian',
  tribalGroup: 'Munda (Recognized Scheduled Tribe)',
  pvtgStatus: false, // Set to false, option to toggle in settings
  annualFamilyIncome: '₹1,85,000 / year',
  totalDisbursedToHousehold: '₹48,820',
  members: [
    {
      id: 'student_priya',
      isPrimary: true,
      name: 'Priya Munda',
      nameHi: 'प्रिया मुंडा',
      relation: 'Daughter (Eldest)',
      educationLevel: 'Under-Graduate (College)',
      institution: 'National Institute of Technology (NIT) Jamshedpur',
      academicProgram: 'B.Tech in Computer Science & Engineering',
      yearOfStudy: '3rd Year (Semester 5)',
      apaarId: 'APAAR-2023-JH-77192',
      aadhaarMasked: 'XXXX-XXXX-4521',
      activeApplicationId: 'APP-NSP-2026-PM7891',
      activeSchemeId: 'post-matric',
      avatarInitials: 'PM',
      canaraBankSFMPLinked: true,
      nspId: 'JH202324001928',
      applications: [
        {
          id: 'APP-NSP-2026-PM7891',
          schemeId: 'post-matric',
          portal: 'NSP',
          appliedDate: '2026-07-28',
          academicSession: '2026-27',
          sanctionAmount: '₹18,500',
          currentStageIndex: 4, // 0 to 4 (4 is disbursed)
          status: 'disbursed',
          statusText: 'DBT Funds Disbursed to Student Account',
          statusType: 'success',
          lastActionDate: '2026-09-12',
          stages: [
            { id: 1, title: 'DigiLocker Identity & ST Verification', date: '2026-07-28', done: true, remarks: 'ST Certificate verified via Jharkhand e-District API' },
            { id: 2, title: 'NIT Jamshedpur Nodal Verification', date: '2026-08-04', done: true, remarks: 'Dean of Student Welfare verified attendance & bonafide' },
            { id: 3, title: 'State Tribal Welfare Dept. Approval', date: '2026-08-18', done: true, remarks: 'Jharkhand Tribal Welfare Directorate approved merit list' },
            { id: 4, title: 'MoTA Ministry Final Sanction', date: '2026-08-30', done: true, remarks: 'MoTA Sanction Order MOTA/SCH/2026/092 released' },
            { id: 5, title: 'PFMS Direct Benefit Transfer', date: '2026-09-12', done: true, remarks: 'PFMS Credit Successful. UTR: RBI2026091298412' }
          ],
          dbtDetails: {
            utrNumber: 'RBI2026091298412',
            bankName: 'State Bank of India (NIT Jamshedpur Branch)',
            accountMasked: 'XXXX-XXXX-8910',
            amountCredited: '₹18,500',
            creditDate: '12 September 2026',
            pfmsSanctionId: 'PFMS-MOTA-2026-8912'
          },
          deficiencies: []
        },
        {
          id: 'APP-SFMP-2026-TC1042',
          schemeId: 'top-class',
          portal: 'SFMP / NSP',
          appliedDate: '2026-08-15',
          academicSession: '2026-27',
          sanctionAmount: 'Full Tuition + ₹36,000 Living Grant',
          currentStageIndex: 2, // In progress
          status: 'action_required',
          statusText: 'Action Required: Income Affidavit Clarification',
          statusType: 'warning',
          lastActionDate: '2026-09-20',
          stages: [
            { id: 1, title: 'DigiLocker Identity & ST Verification', date: '2026-08-15', done: true, remarks: 'Verified against State ST master registry' },
            { id: 2, title: 'NIT Jamshedpur Top Class Verification', date: '2026-08-25', done: true, remarks: 'Premier Institute Nodal Officer confirmed JEE All India Rank' },
            { id: 3, title: 'State Tribal Nodal Inspection', date: '2026-09-20', done: false, active: true, remarks: 'Clarification required: Annual income certificate format update requested' },
            { id: 4, title: 'MoTA National Committee Sanction', date: null, done: false },
            { id: 5, title: 'PFMS Direct Benefit Transfer', date: null, done: false }
          ],
          dbtDetails: null,
          deficiencies: [
            {
              id: 'def_01',
              title: 'Updated Income Certificate Required',
              detail: 'Competent Authority Income certificate for FY 2025-26 needs re-verification due to illegible Tehsildar seal.',
              severity: 'high',
              actionLabel: 'Re-sync DigiLocker Income Certificate'
            }
          ]
        }
      ]
    },
    {
      id: 'student_birsa',
      isPrimary: false,
      name: 'Birsa Munda',
      nameHi: 'बिरसा मुंडा',
      relation: 'Son (Younger Sibling)',
      educationLevel: 'Secondary School (Class IX)',
      institution: 'Eklavya Model Residential School (EMRS), Khunti',
      academicProgram: 'Class IX - CBSE Affiliated',
      yearOfStudy: 'Class 9th',
      apaarId: 'APAAR-2025-JH-11984',
      aadhaarMasked: 'XXXX-XXXX-9014',
      activeApplicationId: 'APP-NSP-2026-PRE5501',
      activeSchemeId: 'pre-matric',
      avatarInitials: 'BM',
      canaraBankSFMPLinked: false,
      nspId: 'JH202425008129',
      applications: [
        {
          id: 'APP-NSP-2026-PRE5501',
          schemeId: 'pre-matric',
          portal: 'NSP',
          appliedDate: '2026-08-01',
          academicSession: '2026-27',
          sanctionAmount: '₹7,000 (Hosteller Allowance & Grants)',
          currentStageIndex: 4,
          status: 'disbursed',
          statusText: 'Disbursed to Guardian Bank Account',
          statusType: 'success',
          lastActionDate: '2026-09-08',
          stages: [
            { id: 1, title: 'EMRS School Enrollment & Verification', date: '2026-08-01', done: true, remarks: 'EMRS Principal digitally approved application via NSP portal' },
            { id: 2, title: 'District Welfare Officer (DWO) Clearance', date: '2026-08-14', done: true, remarks: 'District Tribal Welfare Officer Khunti certified ST authenticity' },
            { id: 3, title: 'State Tribal Welfare Directorate Sanction', date: '2026-08-25', done: true, remarks: 'Approved in Pre-Matric ST State Batch 04' },
            { id: 4, title: 'MoTA Central Matching Share Release', date: '2026-09-02', done: true, remarks: 'MoTA 75% central share credited to State Single Nodal Agency' },
            { id: 5, title: 'PFMS Aadhaar DBT Remittance', date: '2026-09-08', done: true, remarks: 'Credited to Guardian Soma Munda SBI A/c. UTR: SBIN202609088192' }
          ],
          dbtDetails: {
            utrNumber: 'SBIN202609088192',
            bankName: 'State Bank of India (Khunti Main Branch)',
            accountMasked: 'XXXX-XXXX-4491',
            amountCredited: '₹7,000',
            creditDate: '08 September 2026',
            pfmsSanctionId: 'PFMS-EMRS-2026-1082'
          },
          deficiencies: []
        }
      ]
    },
    {
      id: 'student_sunita',
      isPrimary: false,
      name: 'Sunita Munda',
      nameHi: 'सुनीता मुंडा',
      relation: 'Daughter (Sister)',
      educationLevel: 'Post-Graduate (M.Sc)',
      institution: 'Ranchi University, Jharkhand',
      academicProgram: 'M.Sc in Tribal Studies & Botany',
      yearOfStudy: 'Final Year',
      apaarId: 'APAAR-2021-JH-44019',
      aadhaarMasked: 'XXXX-XXXX-7128',
      activeApplicationId: null,
      activeSchemeId: null,
      avatarInitials: 'SM',
      canaraBankSFMPLinked: false,
      nspId: 'JH202122009841',
      applications: []
    }
  ]
}

// ─────────────────────────────────────────────────────────────────────────────
// CROSS-SCHEME DEDUPLICATION & CONFLICT DETECTION RULE ENGINE
// ─────────────────────────────────────────────────────────────────────────────

export const CONFLICT_RULES = {
  // Check if student is allowed to apply for a target scheme given active schemes
  evaluateApplicationConflict: (student, targetSchemeId) => {
    const activeApp = student.applications.find(a => a.status === 'disbursed' || a.status === 'in_progress' || a.status === 'action_required' || a.status === 'under_review')
    
    if (!activeApp) {
      return { hasConflict: false, reason: null, policyClause: null }
    }

    const currentScheme = SCHEMES.find(s => s.id === activeApp.schemeId)
    const targetScheme = SCHEMES.find(s => s.id === targetSchemeId)

    // MoTA Simultaneous Availing Rule
    if (activeApp.schemeId === targetSchemeId) {
      return {
        hasConflict: true,
        type: 'DUPLICATE_APPLICATION',
        title: 'Duplicate Application Detected',
        reason: `You already have an active application (${activeApp.id}) submitted for ${targetScheme.name} for the current academic session.`,
        policyClause: 'Section 4.2 of MoTA Guidelines: Only one active application per scheme per academic cycle is allowed.',
        existingApp: activeApp,
        canRelinquish: false
      }
    }

    // Special case: Post-Matric and Top Class transition
    if (activeApp.schemeId === 'post-matric' && targetSchemeId === 'top-class') {
      return {
        hasConflict: true,
        type: 'SCHEME_SUPERSEDING',
        title: 'MoTA Cross-Portal Conflict: Post-Matric & Top Class',
        reason: `Our Unified Central Registry detected an active disbursement of '${currentScheme.name}' via NSP. Because Top Class covers 100% tuition plus living expenses, MoTA regulations mandate that your existing Post-Matric entitlement must be transitioned or surrendered prior to final Top Class disbursement.`,
        policyClause: 'MoTA Operational Guidelines Para 7.1: A student admitted to a notified Top Class institution must relinquish state Post-Matric assistance upon sanction of the Top Class Central Sector Award.',
        existingApp: activeApp,
        canRelinquish: true,
        recommendation: 'Proceed with provisional Top Class submission. If shortlisted, TRISHA will automatically generate an automated No-Objection Certificate (NOC) and notify the State Welfare Department.'
      }
    }

    // General simultaneous conflict (e.g. Post-Matric vs NFST Fellowship)
    if (activeApp.schemeId === 'post-matric' && (targetSchemeId === 'nfst' || targetSchemeId === 'nos')) {
      return {
        hasConflict: true,
        type: 'SIMULTANEOUS_BENEFIT_BARRED',
        title: 'Strict MoTA Rule: Concurrent Fellowship/Scholarship Barred',
        reason: `National registry check confirmed that Aadhaar ${student.aadhaarMasked} is currently receiving benefits under '${currentScheme.name}' on NSP. Simultaneous receipt of fellowship under SFMP/Canara Bank (${targetScheme.shortName}) is strictly prohibited under Government of India anti-double-dipping rules.`,
        policyClause: 'Rule 11 (General Financial Rules 2017 & MoTA Scheme Guidelines): No scholar shall receive dual financial aid from Central/State Government for the same degree course.',
        existingApp: activeApp,
        canRelinquish: true,
        recommendation: 'To apply for NFST / NOS, you must submit a formal relinquishment declaration for your existing Post-Matric grant.'
      }
    }

    return { hasConflict: false, reason: null, policyClause: null }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// DIGILOCKER & PVTG TRIBAL DOCUMENT VAULT
// ─────────────────────────────────────────────────────────────────────────────

export const DIGILOCKER_VAULT = [
  {
    id: 'DOC-ST-01',
    title: 'Scheduled Tribe Caste Certificate',
    titleHi: 'अनुसूचित जनजाति प्रमाण पत्र',
    issuer: 'State Tribal Welfare Dept., Govt. of Jharkhand',
    certNumber: 'JH/ST/2023/889104',
    issueDate: '15 June 2023',
    verified: true,
    verificationAgency: 'DigiLocker / National e-Governance Division (NeGD)',
    qrHash: 'sha256-e91823abf10928cd991',
    fileSize: '342 KB',
    category: 'Caste & Category',
    validity: 'Lifetime Valid'
  },
  {
    id: 'DOC-AADHAAR-02',
    title: 'Aadhaar e-KYC Identity Card',
    titleHi: 'आधार ई-केवाईसी पहचान पत्र',
    issuer: 'Unique Identification Authority of India (UIDAI)',
    certNumber: 'UIDAI-EKYC-901842',
    issueDate: 'Verified Live via OTP',
    verified: true,
    verificationAgency: 'UIDAI Authentication Service',
    qrHash: 'sha256-44bfa10982312488',
    fileSize: '198 KB',
    category: 'Identity',
    validity: 'NPCI Direct Benefit Transfer Seeded'
  },
  {
    id: 'DOC-INC-03',
    title: 'Annual Income Certificate (FY 2025-26)',
    titleHi: 'आय प्रमाण पत्र (वित्तीय वर्ष 2025-26)',
    issuer: 'Circle Officer, Tehsil Khunti, Jharkhand',
    certNumber: 'JH/INC/2025/110482',
    issueDate: '24 April 2025',
    verified: true,
    verificationAgency: 'Jharkhand JharSewa / DigiLocker',
    qrHash: 'sha256-990a182b8812c',
    fileSize: '412 KB',
    category: 'Income',
    validity: 'Valid through 31 March 2027 (Income: ₹1,85,000)'
  },
  {
    id: 'DOC-ACAD-04',
    title: 'NIT Jamshedpur Bonafide & Fee Structure',
    titleHi: 'संस्थान बोनाफाइड और शुल्क संरचना',
    issuer: 'Dean Academic Affairs, NIT Jamshedpur',
    certNumber: 'NITJSR/ACAD/2026/091',
    issueDate: '22 July 2026',
    verified: true,
    verificationAgency: 'Institute AISHE Portal (AISHE Code: U-0205)',
    qrHash: 'sha256-118fae98129',
    fileSize: '580 KB',
    category: 'Academic',
    validity: 'Academic Year 2026-27'
  },
  {
    id: 'DOC-APAAR-05',
    title: 'APAAR / ABC Academic Credit Registry Card',
    titleHi: 'अपार / एकेडेमिक बैंक ऑफ क्रेडिट कार्ड',
    issuer: 'National Academic Depository (Ministry of Education)',
    certNumber: 'APAAR-2023-JH-77192',
    issueDate: '10 January 2024',
    verified: true,
    verificationAgency: 'DigiLocker NAD',
    qrHash: 'sha256-77881029ba',
    fileSize: '210 KB',
    category: 'Academic Registry',
    validity: 'Permanent Education Record'
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// MULTILINGUAL TRIBAL TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

export const I18N = {
  en: {
    portalName: 'TRISHA',
    portalSub: 'Tribal Integrated Scholarship & Higher-education Access',
    ministry: 'Ministry of Tribal Affairs | Government of India',
    dashboard: 'Dashboard',
    schemes: 'All Schemes',
    applications: 'Track Status',
    documents: 'DigiLocker Vault',
    family: 'Household View',
    eligibility: 'Eligibility Engine',
    assistant: 'Tribal AI Sahayak',
    switchMember: 'Switch Family Member',
    activeSchemes: 'Active Scholarships',
    totalDisbursed: 'Total DBT Disbursed',
    pendingVerification: 'Verification Queue',
    conflictGuard: 'Cross-Scheme Conflict Guard',
    statusActive: 'Active & Disbursed',
    applyNow: 'Check Eligibility & Apply',
    viewDetails: 'View Comprehensive Guidelines',
    offlineMode: 'Offline / Forest Low-Bandwidth Mode',
    offlineActiveMsg: 'Working in Offline Mode. Applications will automatically queue and sync once connectivity is restored in your village cluster.'
  },
  hi: {
    portalName: 'तृषा (TRISHA)',
    portalSub: 'जनजातीय एकीकृत छात्रवृत्ति एवं उच्च शिक्षा पहुंच पोर्टल',
    ministry: 'जनजातीय कार्य मंत्रालय | भारत सरकार',
    dashboard: 'डैशबोर्ड',
    schemes: 'सभी योजनाएं',
    applications: 'आवेदन स्थिति',
    documents: 'डिजिलॉकर वॉल्ट',
    family: 'परिवार निगरानी',
    eligibility: 'पात्रता इंजन',
    assistant: 'जनजातीय एआई सहायक',
    switchMember: 'परिवार सदस्य बदलें',
    activeSchemes: 'सक्रिय छात्रवृत्तियां',
    totalDisbursed: 'कुल डीबीटी राशि',
    pendingVerification: 'सत्यापन प्रक्रिया',
    conflictGuard: 'योजना टकराव रोकथाम प्रणाली',
    statusActive: 'सक्रिय एवं वितरित',
    applyNow: 'पात्रता जांचें व आवेदन करें',
    viewDetails: 'विस्तृत दिशा-निर्देश देखें',
    offlineMode: 'ऑफलाइन / वन क्षेत्र मोड',
    offlineActiveMsg: 'ऑफलाइन मोड सक्रिय है। जब आपके गांव या ब्लॉक में नेटवर्क उपलब्ध होगा, आवेदन स्वतः सिंक हो जाएंगे।'
  },
  santhali: {
    portalName: 'ᱴᱨᱤᱥᱟ (TRISHA)',
    portalSub: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱮᱪᱮᱫ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱚᱨᱴᱟᱞ',
    ministry: 'ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ | ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ',
    dashboard: 'ᱢᱩᱬᱩᱛ ᱥᱟᱦᱴᱟ',
    schemes: 'ᱥᱟᱱᱟᱢ  আঁচᱚᱱ',
    applications: 'ᱟᱨᱡᱤ ᱦᱟᱞᱚᱛ',
    documents: 'ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱥᱟᱠᱟᱢ',
    family: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱧᱮᱞ',
    eligibility: 'যোগ্যতা বাছাও',
    assistant: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱜᱚᱲᱚᱣᱟᱱ',
    switchMember: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱦᱚᱲ ᱵᱚᱫᱚᱞ',
    activeSchemes: 'ᱪᱟᱹᱞᱩ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ',
    totalDisbursed: 'ᱡᱚᱛᱚ ᱴᱟᱠᱟ ᱧᱟᱢ',
    pendingVerification: 'ᱛᱩᱞᱟᱹᱡᱚᱠᱷᱟ',
    conflictGuard: 'ᱫᱚᱦᱲᱟ ᱟᱨᱡᱤ ᱨᱩᱠᱷᱤᱭᱟᱹ',
    statusActive: 'ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ',
    applyNow: 'ᱟᱨᱡᱤ ᱢᱮ',
    viewDetails: 'ᱵᱤᱵᱚᱨᱚᱱ ᱧᱮᱞ',
    offlineMode: 'ᱵᱤᱨ ᱚᱯᱷᱞᱟᱭᱤᱱ ᱢᱚᱰ',
    offlineActiveMsg: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱨᱮ ᱠᱟᱹᱢᱤ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜ-ᱟ᱾ ᱱᱮᱴᱣᱚᱨᱠ ᱦᱮᱡ ᱞᱮᱱᱠᱷᱟᱱ ᱟᱡ ᱛᱮᱜᱮ ᱡᱚᱲᱟᱣᱜ-ᱟ᱾'
  },
  gondi: {
    portalName: 'त्रिशा (TRISHA)',
    portalSub: 'कोयतुर एकीकृत छात्रवृत्ति एवं उच्च शिक्षा पोर्टल',
    ministry: 'जनजातीय कार्य मंत्रालय | भारत सरकार',
    dashboard: 'मुखड़ा',
    schemes: 'सब्बों योजनांग',
    applications: 'अर्जी हाल',
    documents: 'कागद पत्र (DigiLocker)',
    family: 'कुटुम दर्शन',
    eligibility: 'लायक जांच',
    assistant: 'सहायी संगी',
    switchMember: 'कुटुम सदस्य बदल कीम',
    activeSchemes: 'चालू छात्रवृत्ति',
    totalDisbursed: 'जमा पोना पैसा',
    pendingVerification: 'जांच चलिस',
    conflictGuard: 'दुगना लाभ रोक',
    statusActive: 'चालू मंता',
    applyNow: 'अर्जी वाट',
    viewDetails: 'पूरो विवरण',
    offlineMode: 'जंगल नेटवर्क रहित मोड',
    offlineActiveMsg: 'नेटवर्क हिले मंता। नेटवर्क वाना संगे संगे सब्बों अर्जिंग सरकार कड़े पहुंच जायिन।'
  }
}
