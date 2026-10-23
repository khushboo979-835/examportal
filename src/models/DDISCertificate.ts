import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type CertificateValidity = 'VALID' | 'REVOKED';

export interface IDDISCertificate extends Document {
  certificateId: string;
  userId: Types.ObjectId;
  internshipId?: Types.ObjectId;
  studentName: string;
  collegeName: string;
  stream: string;
  faculty?: string;
  trackTitle: string;
  degreeProgram?: string;
  durationWeeks?: number;
  nepCurriculumHours?: number;
  grade?: string;
  issueDate: Date;
  validityStatus: CertificateValidity;
  qrCodeDataUrl?: string;
  pdfKey?: string;
  certificatePdfUrl?: string;
  verificationUrl: string;
  accreditationAuthority: string;
  createdAt: Date;
  updatedAt: Date;
}

const DDISCertificateSchema = new Schema<IDDISCertificate>(
  {
    certificateId: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    internshipId: { type: Schema.Types.ObjectId, ref: 'StudentInternship' },
    studentName: { type: String, required: true, trim: true },
    collegeName: { type: String, required: true, trim: true },
    stream: { type: String, required: true },
    faculty: { type: String },
    trackTitle: { type: String, required: true },
    degreeProgram: { type: String, default: 'Undergraduate Program' },
    durationWeeks: { type: Number, default: 4 },
    nepCurriculumHours: { type: Number, default: 75 },
    grade: { type: String, default: 'A+ (Distinction)' },
    issueDate: { type: Date, default: Date.now },
    validityStatus: {
      type: String,
      enum: ['VALID', 'REVOKED'],
      default: 'VALID',
      index: true,
    },
    qrCodeDataUrl: { type: String },
    pdfKey: { type: String },
    certificatePdfUrl: { type: String },
    verificationUrl: { type: String, required: true },
    accreditationAuthority: {
      type: String,
      default: 'Digital Developer Infinity Solution (DDIS) • NEP-2020 Compliant',
    },
  },
  {
    timestamps: true,
  }
);

export const DDISCertificate: Model<IDDISCertificate> =
  mongoose.models.DDISCertificate ||
  mongoose.model<IDDISCertificate>('DDISCertificate', DDISCertificateSchema);

export default DDISCertificate;
