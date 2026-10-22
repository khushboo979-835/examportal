import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type StreamType = 'SCIENCE' | 'COMMERCE' | 'ARTS' | 'BCA_IT' | 'MANAGEMENT';
export type SubmissionType = 'GITHUB' | 'DRIVE_LINK' | 'LIVE_URL' | 'DOCUMENT';

export interface IMilestone {
  weekNumber: number;
  title: string;
  taskDescription: string;
  resourceMaterialUrl?: string;
  submissionType: SubmissionType;
}

export interface IInternshipTrack extends Document {
  title: string;
  slug: string;
  stream: StreamType;
  nepAligned: boolean;
  durationWeeks: number;
  shortDescription: string;
  learningOutcomes: string[];
  milestones: IMilestone[];
  fee: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MilestoneSchema = new Schema<IMilestone>({
  weekNumber: { type: Number, required: true },
  title: { type: String, required: true },
  taskDescription: { type: String, required: true },
  resourceMaterialUrl: { type: String, default: '' },
  submissionType: {
    type: String,
    enum: ['GITHUB', 'DRIVE_LINK', 'LIVE_URL', 'DOCUMENT'],
    default: 'GITHUB',
  },
});

const InternshipTrackSchema = new Schema<IInternshipTrack>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    stream: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'MANAGEMENT'],
      required: true,
      index: true,
    },
    nepAligned: { type: Boolean, default: true, index: true },
    durationWeeks: { type: Number, default: 4, enum: [4, 8] },
    shortDescription: { type: String, required: true },
    learningOutcomes: [{ type: String }],
    milestones: [MilestoneSchema],
    fee: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

InternshipTrackSchema.index({ stream: 1, isActive: 1 });

export const InternshipTrack: Model<IInternshipTrack> =
  mongoose.models.InternshipTrack ||
  mongoose.model<IInternshipTrack>('InternshipTrack', InternshipTrackSchema);

export default InternshipTrack;
