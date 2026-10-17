import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type PassType = 'STATE_PASS' | 'CENTRAL_EXAM_PASS' | 'SCHOOL_BOARD_PASS' | 'ULTIMATE_ALL_ACCESS';

export interface IBundleOrPass extends Document {
  _id: Types.ObjectId;
  title: string;
  slug: string;
  passType: PassType;
  validityDays: number;
  price: number;
  discountedPrice?: number;
  includedExams: Types.ObjectId[];
  featuresList: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const BundleOrPassSchema: Schema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    passType: {
      type: String,
      enum: ['STATE_PASS', 'CENTRAL_EXAM_PASS', 'SCHOOL_BOARD_PASS', 'ULTIMATE_ALL_ACCESS'],
      default: 'STATE_PASS',
      required: true,
      index: true,
    },
    validityDays: { type: Number, default: 365, min: 1 },
    price: { type: Number, required: true, min: 0 },
    discountedPrice: { type: Number, min: 0 },
    includedExams: [{ type: Schema.Types.ObjectId, ref: 'ExamNode', index: true }],
    featuresList: [{ type: String, trim: true }],
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

BundleOrPassSchema.index({ passType: 1, isActive: 1 });
BundleOrPassSchema.index({ price: 1, isActive: 1 });

export const BundleOrPass: Model<IBundleOrPass> =
  mongoose.models.BundleOrPass || mongoose.model<IBundleOrPass>('BundleOrPass', BundleOrPassSchema);

export default BundleOrPass;
