# 🏛️ TRISHA: Tribal Integrated Scholarship & Higher-education Access
### Unified Scholarship, Fellowship & Grievance Governance Portal
**Smart India Hackathon (SIH 2026) · Problem Statement ID: 26238**  
**Ministry / Organization:** Ministry of Tribal Affairs (MoTA), Government of India  
**Category:** Software · Web & Mobile Application  
**Official Live Portal:** [https://sih26238-omega.vercel.app](https://sih26238-omega.vercel.app)  
**GitHub Repository:** [shaheed3515/trisha-unified-scholarship-portal](https://github.com/shaheed3515/trisha-unified-scholarship-portal)

---

## 1. Executive Summary & Problem Context (SIH 26238)

The **Ministry of Tribal Affairs (MoTA)** administers five flagship scholarship and fellowship schemes designed to empower Scheduled Tribe (ST) students from school level up to post-doctoral research in world-renowned universities. However, these schemes are operated across **disjointed, siloed portals**, creating administrative friction, fund leakages, and document exhaustion for tribal students.

### The 5 MoTA Flagship Schemes:
1. **Pre-Matric Scholarship for ST Students** (Classes IX & X) — Administered via National Scholarship Portal (NSP); 75:25 Central:State funding ratio to arrest dropouts.
2. **Post-Matric Scholarship for ST Students** (Class XI through Post-Graduation) — Administered via NSP; tuition fee + maintenance allowance credited via PFMS DBT.
3. **Top Class Education for ST Students** (Degree / PG in premier notified institutes like IITs, NITs, IIMs, AIIMS, NLUs) — 100% Central Sector funding for full tuition + ₹36,000/yr living allowance + ₹53,000 one-time hardware grant.
4. **National Fellowship for Higher Education of ST Students (NFST)** (M.Phil & Ph.D. scholars) — Administered via Canara Bank Scholarship & Fellowship Management Portal (SFMP); JRF ₹37,000/month, SRF ₹42,000/month.
5. **National Overseas Scholarship for ST Candidates (NOS)** (Masters & Ph.D. in foreign QS Top 500 universities) — Administered via standalone MoTA Overseas Portal; 100% tuition, annual living allowance ($15,400 / £9,900), and visa/airfare.

### Critical Systemic Bottlenecks Identified in PS 26238:
* **Cross-Scheme Disjointed Portals**: Students must maintain separate logins across NSP (Pre/Post-Matric), Canara Bank SFMP (Fellowship), and the NOS standalone portal.
* **Double-Dipping & Cross-Scheme Conflicts**: Under **Rule 11 of GFR 2017** and MoTA Para 7.1, a beneficiary cannot simultaneously draw two government scholarships. Currently, because portals do not talk to each other, students either unknowingly receive double disbursement or get trapped in verification bottlenecks without an automated relinquishment mechanism.
* **Lack of Household / Sibling Visibility**: Portals only evaluate isolated students. Sibling and family grant ceilings cannot be tracked, preventing equitable distribution among Particularly Vulnerable Tribal Groups (PVTGs).
* **Document Re-Upload Fatigue**: An ST student must repeatedly obtain, scan, and physical-verify their caste, domicile, and income certificates for each scheme.
* **Linguistic & Accessibility Exclusion**: Tribal students from remote forest clusters (e.g., Khunti, Bastar, Mayurbhanj) lack English/Hindi fluency and face severe low-bandwidth connectivity constraints.

---

## 2. TRISHA: The Unified Architectural Solution

**TRISHA** (*Tribal Integrated Scholarship & Higher-education Access*) unifies all 5 MoTA schemes under a single digital window with real-time API integrations, DigiLocker verification, automated cross-scheme conflict audit, and native tribal dialect AI assistance.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       TRISHA UNIFIED TRIBAL PORTAL                          │
├────────────────────────────────┬────────────────────────────────────────────┤
│  Student & Family Interface    │  Administrative & Ministry Intelligence    │
│  • Single APAAR / Aadhaar SSO  │  • Real-Time GFR Rule 11 Conflict Engine   │
│  • DigiLocker Document Vault   │  • Unified PFMS DBT Disbursement Pool      │
│  • Household Multi-Child View  │  • Automated NoC & Relinquishment Workflow │
│  • 7-Language Native Engine    │  • MongoDB Cloud Database & Audit Logs     │
│  • Low-Bandwidth Offline Mode  │  • Google Gemini Live AI Grounded Sahayak  │
└────────────────────────────────┴────────────────────────────────────────────┘
```

---

## 3. Team Contributions & Division of Developments

### Part A: Core Portal Infrastructure, Backend & AI (Our Developments)
1. **Clean Minimal White Design System & WCAG AA Accessibility**:
   - Replaced heavy navy blues with institutional slate neutrals (`#0f172a`, `#1e293b`, `#f8fafc`).
   - Eliminated right-side layout gaps; full-width fluid responsive scaling across mobile, tablet, and desktop.
   - Built full WCAG compliance: keyboard focus rings, accessible semantic ARIA roles, and high-contrast color hierarchy.
2. **Unified Full-Stack Express & MongoDB Atlas Backend**:
   - Built production Express backend server with 7 Mongoose schemas: `Scheme`, `Student`, `Household`, `Application`, `Document`, `ConflictLog`, and `Notification`.
   - Connected to cloud-hosted MongoDB Atlas with an automated seeder that populates realistic MoTA demo data on boot.
   - Configured unified static serving so the backend serves the built React frontend (`dist/`) and `/api/*` under a single origin.
3. **Live "Tribal AI Sahayak" Powered by Google Gemini (`gemini-flash-latest`)**:
   - Integrated Google Gemini API route (`POST /api/chat`) grounded in official MoTA rules, eligibility ceilings, and Rule 11 conflict resolutions.
   - Multi-model fallback resilience (`gemini-flash-latest` → `gemini-3.8-flash` → `gemini-3.5-flash`) for 100% uptime.
   - Dynamic prompt injection incorporating the logged-in student's live demographic profile and active scholarship status.
4. **Mobile-First Bottom Navigation Bar (`<MobileNav />`)**:
   - Touch-friendly 6-tab fixed bottom navigation bar with badging for pending verification deficiencies and active status tabs.
   - Compact responsive header featuring the national emblem and MoTA branding when the sidebar is collapsed on mobile.
5. **Deployment & DevOps Automation**:
   - Zero-configuration production setup for Vercel (Global CDN) and Render.
   - Enforced strict repository sanitization: `.gitignore` and `.vercelignore` isolation ensuring zero secret leaks (`.env` credentials strictly guarded).

---

### Part B: Smart Eligibility Engine & 7-Language Localization (Collaborator Developments — Asma Eram)
1. **Smart Eligibility & Conflict Engine (`EligibilityFinder.jsx`)**:
   - Interactive 1-minute calculator evaluating academic level, institute tier (Premier/Central/Foreign), family income, and UGC-NET/JRF qualifications.
   - **4 Pre-Built 1-Click Demonstration Scenarios**:
     * 🎓 *NIT/IIT Student (Top Class)*: Calculates full tuition + ₹2,000/mo allowance and flags conflicts with active Post-Matric grants.
     * 🔬 *Ph.D. Scholar (NFST)*: Recommends ₹37,000/month fellowship disbursement via Canara Bank SFMP.
     * ✈️ *Abroad Study (NOS)*: Evaluates foreign university qualification against the ₹6.00 Lakh family income ceiling.
     * 🏫 *Secondary Student (Pre-Matric)*: Validates high school dropout-prevention grants for Classes 9–10.
2. **Automated NOC & Scholarship Switch Wizard**:
   - Implemented an automated digital relinquishment pipeline. When an upgraded grant is selected, TRISHA generates an instant online No Objection Certificate (NOC) and re-routes verified DigiLocker credentials to the new scheme without physical office visits.
3. **Full 7-Language Multilingual Localization Engine (`localizationEngine.js`)**:
   - Engineered complete portal translation into **7 national and tribal languages**:
     1. **English**
     2. **Hindi** (हिंदी)
     3. **Santhali** (in authentic native **Ol Chiki script ᱚᱞ ᱪᱤᱠᱤ**: `ᱯᱨᱤᱭᱟ ᱢᱩᱱᱰᱟ`)
     4. **Gondi** (गोंडी)
     5. **Ho** (ᱦᱳ)
     6. **Bodo** (बड़ो)
     7. **Kui** (କୁଇ in Odia script)
   - Eliminates hardcoded English text leaks: student profile details, degree levels, institution names, household grant totals, deficiency query cards, and status milestones all adapt dynamically to the student's selected language.
4. **Header & Dashboard Action Triggers**:
   - Prominent *"Launch Eligibility Engine"* hero card and quick-action button on both Dashboard and Header.

---

## 4. Key Pages & Walkthrough for Evaluators

| View / Module | Purpose | Key Innovations |
| :--- | :--- | :--- |
| **Unified Dashboard** | Central command center for the student | Real-time status cards, DigiLocker verification badge (5/5), active DBT disbursements, and live deficiency warning cards. |
| **Smart Eligibility Engine** | Intelligent recommendation & GFR audit | 1-click test scenarios, dynamic monthly allowance calculation, and immediate Rule 11 conflict detection. |
| **Application Tracker** | End-to-end audit trail across all 5 schemes | Visual 5-stage milestone tracker (DigiLocker → Institute Nodal Officer → State Directorate → MoTA Central → PFMS DBT) with 1-click DigiLocker re-verification. |
| **DigiLocker Document Vault** | Reusable verified credentials | Permanent repository for ST Caste Certificate, Income Certificate, 10th/12th Marksheets, Bonafide, and Aadhaar; eliminates re-upload fatigue. |
| **Household & Sibling View** | Family-centric equity monitoring | Displays all siblings under one Ration/Family ID (Priya Munda, Birsa Munda, Anita Munda), cumulative household scholarship pool (₹48,820), and equitable distribution metrics. |
| **Tribal AI Sahayak** | 24/7 grounded multilingual guidance | Real-time AI chat powered by Gemini; answers complex policy queries in Hindi, Santhali, Gondi, and English with official MoTA grounding. |

---

## 5. Technology Stack Summary

```
Frontend Architecture:
├── React 18 (Single Page Application)
├── Vite 6.0 (High-Speed Build Pipeline)
├── Lucide React (Clean Institutional Iconography)
├── Vanilla CSS Design System (Zero Heavy Framework Bloat)
└── Dynamic Localization Engine (7 Native & Tribal Languages)

Backend Architecture:
├── Node.js (v20+ Runtime)
├── Express 5 (RESTful API Gateway & Static Bundle Server)
├── MongoDB Atlas (M0 Cloud Cluster with 7 Mongoose Schemas)
└── Google Generative AI SDK (@google/generative-ai, Gemini Flash)

DevOps & Hosting:
├── Vercel Production Global CDN: https://sih26238-omega.vercel.app
├── GitHub CI/CD: Automated preview & production deployments
└── Render Cloud Web Service: Blueprint specification in render.yaml
```

---

## 6. Why TRISHA Wins SIH 2026 (Judge Evaluation Highlights)

1. **Zero Fund Leakage via Real-Time GFR Rule 11 Enforcement**:
   Prevents double disbursements across Central and State portals before sanction letters are issued, saving public funds.
2. **Empowerment Through Authentic Tribal Scripts (Ol Chiki, Gondi, Ho, Bodo, Kui)**:
   Not just standard machine translation—TRISHA uses genuine tribal scripts and dialectal terms, ensuring true digital inclusion for first-generation tribal learners.
3. **End-to-End Paperless Verification**:
   Leverages APAAR ID and DigiLocker API integration to reduce scholarship processing turnaround times from months to days.
4. **Household Welfare Multiplier**:
   Pioneers the concept of a *"Household Scholarship DBT Pool"* to ensure multi-child tribal families receive balanced support across primary, secondary, and higher education.
5. **Production-Ready & Fully Live**:
   Not a mock concept or slide deck—an active, responsive, production web application deployed and verifiable right now at [https://sih26238-omega.vercel.app](https://sih26238-omega.vercel.app).
