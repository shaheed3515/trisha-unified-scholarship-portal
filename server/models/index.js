// ─────────────────────────────────────────────────────────────────────────────
// TRISHA Mongoose Models — MongoDB Atlas Schema Definitions
// ─────────────────────────────────────────────────────────────────────────────

import mongoose from 'mongoose'
const { Schema, model } = mongoose

// ──── MoTA Scholarship Schemes ────
const SchemeSchema = new Schema({
  _id: String, // 'pre-matric', 'post-matric', etc.
  code: { type: String, required: true },
  name: { type: String, required: true },
  nameHi: String,
  shortName: { type: String, required: true },
  portal: { type: String, required: true },
  portalFullName: String,
  targetGroup: String,
  category: String,
  fundingRatio: String,
  amountRange: String,
  deadline: String,
  description: String
}, { timestamps: true })

// ──── Tribal Household Registry ────
const HouseholdSchema = new Schema({
  _id: String, // 'HH-JH-2023-90812'
  rationCard: String,
  village: String,
  district: String,
  state: String,
  headName: { type: String, required: true },
  tribalGroup: String,
  pvtgStatus: { type: Boolean, default: false },
  annualIncome: String
}, { timestamps: true })

// ──── Verification Stage (embedded in Application) ────
const VerificationStageSchema = new Schema({
  stageNumber: { type: Number, required: true },
  title: { type: String, required: true },
  date: String,
  isDone: { type: Boolean, default: false },
  isActive: { type: Boolean, default: false },
  remarks: String
}, { _id: false })

// ──── PFMS DBT Transaction (embedded in Application) ────
const DBTTransactionSchema = new Schema({
  utrNumber: { type: String, required: true },
  bankName: String,
  accountMasked: String,
  amountCredited: String,
  creditDate: String,
  pfmsSanctionId: String
}, { _id: false })

// ──── Deficiency Record (embedded in Application) ────
const DeficiencySchema = new Schema({
  field: String,
  issue: String,
  raisedBy: String,
  raisedDate: String,
  severity: { type: String, enum: ['critical', 'moderate', 'info'], default: 'moderate' }
}, { _id: false })

// ──── Scholarship Application ────
const ApplicationSchema = new Schema({
  _id: String, // 'APP-NSP-2026-PM7891'
  studentId: { type: String, ref: 'Student', required: true },
  schemeId: { type: String, ref: 'Scheme', required: true },
  portal: { type: String, required: true },
  appliedDate: String,
  academicSession: String,
  sanctionAmount: String,
  status: { type: String, enum: ['submitted', 'under_review', 'action_required', 'sanctioned', 'disbursed', 'rejected'], default: 'submitted' },
  statusText: String,
  statusType: { type: String, default: 'primary' },
  lastActionDate: String,
  stages: [VerificationStageSchema],
  dbtDetails: DBTTransactionSchema,
  deficiencies: [DeficiencySchema]
}, { timestamps: true })

// ──── DigiLocker Document ────
const DocumentSchema = new Schema({
  _id: String,
  studentId: { type: String, ref: 'Student', required: true },
  title: { type: String, required: true },
  titleHi: String,
  issuer: String,
  certNumber: String,
  issueDate: String,
  verified: { type: Boolean, default: false },
  verificationAgency: String,
  qrHash: String,
  fileSize: String,
  category: String,
  validity: String
}, { timestamps: true })

// ──── ST Student / Beneficiary ────
const StudentSchema = new Schema({
  _id: String, // 'student_priya'
  householdId: { type: String, ref: 'Household', required: true },
  name: { type: String, required: true },
  nameHi: String,
  relation: String,
  educationLevel: String,
  institution: String,
  academicProgram: String,
  yearOfStudy: String,
  apaarId: String,
  aadhaarMasked: String,
  nspId: String,
  isPrimary: { type: Boolean, default: false },
  avatarInitials: String
}, { timestamps: true })

// ──── Cross-Scheme Conflict Audit Log ────
const ConflictLogSchema = new Schema({
  studentId: { type: String, ref: 'Student', required: true },
  existingAppId: String,
  targetSchemeId: String,
  conflictType: String,
  resolution: String,
  nocReference: String
}, { timestamps: true })

// ──── Notifications ────
const NotificationSchema = new Schema({
  _id: String,
  studentId: { type: String, ref: 'Student', required: true },
  title: { type: String, required: true },
  body: String,
  type: { type: String, enum: ['success', 'warning', 'info', 'error'], default: 'info' },
  isRead: { type: Boolean, default: false }
}, { timestamps: true })

// Export Models
export const Scheme = model('Scheme', SchemeSchema)
export const Household = model('Household', HouseholdSchema)
export const Student = model('Student', StudentSchema)
export const Application = model('Application', ApplicationSchema)
export const Document = model('Document', DocumentSchema)
export const ConflictLog = model('ConflictLog', ConflictLogSchema)
export const Notification = model('Notification', NotificationSchema)
