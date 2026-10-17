import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type MaterialType = 'NOTES' | 'SOLVED_PYQ' | 'MOCK_PAPER' | 'FORMULA_SHEET' | 'SYLLABUS_SUMMARY';
export type Medium = 'HINDI' | 'ENGLISH' | 'BILINGUAL';
export type AccessType = 'FREE' | 'PREMIUM' | 'PASS_ONLY';

export interface IPDFProduct extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  sectorId: Types.ObjectId;
  categoryId: Types.ObjectId;
  examNodeId: Types.ObjectId;
  subjectId?: Types.ObjectId;
  subject: string;
  chapterNumber?: number;
  year?: number;
  materialType: MaterialType;
  medium: Medium;
  accessType: AccessType;
  price: number;
  discountedPrice?: number;
  fileKey: string;
  previewKey: string;
  totalPages: number;
  pageCount?: number;
  fileSizeBytes: number;
  fileSize?: number;
  avgRating: number;
  rating?: number;
  totalReviews: number;
  reviewCount?: number;
  searchTags: string[];
  isPassEligible: boolean;
  isPublished: boolean;
  totalDownloads: number;
  totalSales: number;
  createdAt: Date;
  updatedAt: Date;
}

const PDFProductSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    sectorId: { type: Schema.Types.ObjectId, ref: 'Sector', required: true, index: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    examNodeId: { type: Schema.Types.ObjectId, ref: 'ExamNode', required: true, index: true },
    subjectId: { type: Schema.Types.ObjectId, ref: 'Subject', index: true },
    subject: { type: String, default: 'General', trim: true, index: true },
    chapterNumber: { type: Number, min: 0 },
    year: { type: Number, default: 2026, index: true },
    materialType: {
      type: String,
      enum: ['NOTES', 'SOLVED_PYQ', 'MOCK_PAPER', 'FORMULA_SHEET', 'SYLLABUS_SUMMARY'],
      default: 'NOTES',
      required: true,
      index: true,
    },
    medium: {
      type: String,
      enum: ['HINDI', 'ENGLISH', 'BILINGUAL'],
      default: 'BILINGUAL',
      required: true,
      index: true,
    },
    accessType: {
      type: String,
      enum: ['FREE', 'PREMIUM', 'PASS_ONLY'],
      default: 'PREMIUM',
      required: true,
      index: true,
    },
    price: { type: Number, default: 0, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    fileKey: { type: String, required: true },
    previewKey: { type: String, required: true },
    totalPages: { type: Number, required: true, min: 1 },
    fileSizeBytes: { type: Number, required: true, min: 0 },
    avgRating: { type: Number, default: 5.0, min: 1, max: 5 },
    rating: { type: Number, default: 4.9 },
    totalReviews: { type: Number, default: 0, min: 0 },
    reviewCount: { type: Number, default: 1 },
    searchTags: [{ type: String, trim: true }],
    isPassEligible: { type: Boolean, default: true, index: true },
    isPublished: { type: Boolean, default: true, index: true },
    totalDownloads: { type: Number, default: 0, min: 0 },
    totalSales: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// High-Throughput Compound Indexes
PDFProductSchema.index(
  { title: 'text', searchTags: 'text' },
  {
    weights: { title: 10, searchTags: 5 },
    default_language: 'none',
    language_override: 'none',
    name: 'pdfproduct_text_idx',
  }
);

PDFProductSchema.index({ examNodeId: 1, subjectId: 1, materialType: 1, isPublished: 1 });
PDFProductSchema.index({ categoryId: 1, isPublished: 1 });
PDFProductSchema.index({ sectorId: 1, isPublished: 1 });
PDFProductSchema.index({ isPassEligible: 1, isPublished: 1 });
PDFProductSchema.index({ accessType: 1, isPublished: 1 });
PDFProductSchema.index({ year: 1, isPublished: 1 });
PDFProductSchema.index({ totalDownloads: -1, isPublished: 1 });

export const PDFProduct: Model<IPDFProduct> =
  mongoose.models.PDFProduct || mongoose.model<IPDFProduct>('PDFProduct', PDFProductSchema);

export default PDFProduct;
