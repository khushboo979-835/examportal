import mongoose, { Schema, Document, Model } from 'mongoose';

export type StreamType =
  | 'SCIENCE'
  | 'COMMERCE'
  | 'ARTS'
  | 'BCA_IT'
  | 'IT'
  | 'MANAGEMENT'
  | 'VOCATIONAL';

export type SubmissionType = 'GITHUB' | 'DRIVE_LINK' | 'LIVE_URL' | 'DOCUMENT';

export interface IMilestone {
  weekNumber: number;
  title: string;
  theoryOverview?: string;
  taskDescription: string;
  resourceMaterialUrl?: string;
  resourcePdfUrl?: string;
  submissionType: SubmissionType;
  estimatedHours?: number;
}

export interface IInternshipTrack extends Document {
  title: string;
  slug: string;
  stream: StreamType;
  faculty: StreamType;
  nepAligned: boolean;
  nepCurriculumHours: number;
  creditHours?: number;
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
  theoryOverview: { type: String, default: '' },
  taskDescription: { type: String, required: true },
  resourceMaterialUrl: { type: String, default: '' },
  resourcePdfUrl: { type: String, default: '' },
  submissionType: {
    type: String,
    enum: ['GITHUB', 'DRIVE_LINK', 'LIVE_URL', 'DOCUMENT'],
    default: 'GITHUB',
  },
  estimatedHours: { type: Number, default: 18 },
});

const InternshipTrackSchema = new Schema<IInternshipTrack>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    stream: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      required: true,
      index: true,
    },
    faculty: {
      type: String,
      enum: ['SCIENCE', 'COMMERCE', 'ARTS', 'BCA_IT', 'IT', 'MANAGEMENT', 'VOCATIONAL'],
      default: function (this: any) {
        return this.stream;
      },
      index: true,
    },
    nepAligned: { type: Boolean, default: true, index: true },
    nepCurriculumHours: { type: Number, default: 75 },
    creditHours: { type: Number, default: 75 },
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
InternshipTrackSchema.index({ faculty: 1, isActive: 1 });

export const InternshipTrack: Model<IInternshipTrack> =
  mongoose.models.InternshipTrack ||
  mongoose.model<IInternshipTrack>('InternshipTrack', InternshipTrackSchema);

export default InternshipTrack;
