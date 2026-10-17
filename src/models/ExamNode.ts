import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IExamNode extends Document {
  _id: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  slug: string;
  state: string;
  iconUrl?: string;
  description?: string;
  targetYear: string;
  isTrending: boolean;
  totalPdfsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ExamNodeSchema: Schema = new Schema(
  {
    categoryId: { type: Schema.Types.ObjectId, ref: 'Category', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    state: { type: String, default: 'National/Central', trim: true, index: true },
    iconUrl: { type: String, default: '' },
    description: { type: String, default: '' },
    targetYear: { type: String, default: '2026-2027' },
    isTrending: { type: Boolean, default: false, index: true },
    totalPdfsCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound Indexes for fast hierarchy filtering
ExamNodeSchema.index({ state: 1, isTrending: -1 });
ExamNodeSchema.index({ categoryId: 1, isTrending: -1 });
ExamNodeSchema.index({ categoryId: 1, totalPdfsCount: -1 });

export const ExamNode: Model<IExamNode> =
  mongoose.models.ExamNode || mongoose.model<IExamNode>('ExamNode', ExamNodeSchema);

export default ExamNode;
