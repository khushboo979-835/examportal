import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IDownloadLog extends Document {
  userId?: mongoose.Types.ObjectId;
  userPhone: string;
  userEmail?: string;
  pdfProductId?: mongoose.Types.ObjectId;
  pdfTitle: string;
  pdfSlug: string;
  orderId?: string;
  ipAddress?: string;
  userAgent?: string;
  downloadedAt: Date;
}

const DownloadLogSchema = new Schema<IDownloadLog>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    userPhone: { type: String, required: true, index: true },
    userEmail: { type: String, default: 'student@exampass.in' },
    pdfProductId: { type: Schema.Types.ObjectId, ref: 'PDFProduct', index: true },
    pdfTitle: { type: String, required: true },
    pdfSlug: { type: String, required: true },
    orderId: { type: String, default: 'TESTBOOK-PASS' },
    ipAddress: { type: String, default: '127.0.0.1' },
    userAgent: { type: String, default: 'Mozilla/5.0' },
    downloadedAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export const DownloadLog: Model<IDownloadLog> =
  mongoose.models.DownloadLog || mongoose.model<IDownloadLog>('DownloadLog', DownloadLogSchema);
