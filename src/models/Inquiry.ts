import mongoose, { Schema, Document } from 'mongoose';

export interface IInquiry extends Document {
  ticketId: string;
  name: string;
  email?: string;
  phone?: string;
  category: string;
  subject?: string;
  message: string;
  status: 'NEW' | 'RESPONDED' | 'RESOLVED';
  emailSent: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const InquirySchema = new Schema<IInquiry>(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    category: { type: String, default: 'GENERAL_QUERY' },
    subject: { type: String, default: 'Student Inquiry' },
    message: { type: String, required: true },
    status: { type: String, enum: ['NEW', 'RESPONDED', 'RESOLVED'], default: 'NEW' },
    emailSent: { type: Boolean, default: false },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Inquiry = mongoose.models.Inquiry || mongoose.model<IInquiry>('Inquiry', InquirySchema);
