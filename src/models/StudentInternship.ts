import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type InternshipStatus = 'ENROLLED' | 'IN_PROGRESS' | 'REVIEW_PENDING' | 'COMPLETED';
export type SubmissionStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface ISubmission {
  weekNumber: number;
  submissionUrl: string;
  submittedAt: Date;
  status: SubmissionStatus;
  mentorFeedback?: string;
}

export interface IStudentInternship extends Document {
  userId: Types.ObjectId;
  trackId: Types.ObjectId;
  studentName?: string;
  studentEmail?: string;
  studentPhone?: string;
  collegeName: string;
  rollNumber: string;
  degreeProgram: string;
  status: InternshipStatus;
  startDate: Date;
  completedDate?: Date;
  submissions: ISubmission[];
  certificateIssued: boolean;
  certificateId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>({
  weekNumber: { type: Number, required: true },
  submissionUrl: { type: String, required: true },
  submittedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['SUBMITTED', 'APPROVED', 'REJECTED'],
    default: 'SUBMITTED',
  },
  mentorFeedback: { type: String, default: '' },
});

const StudentInternshipSchema = new Schema<IStudentInternship>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    trackId: { type: Schema.Types.ObjectId, ref: 'InternshipTrack', required: true, index: true },
    studentName: { type: String },
    studentEmail: { type: String },
    studentPhone: { type: String },
    collegeName: { type: String, required: true },
    rollNumber: { type: String, required: true },
    degreeProgram: { type: String, required: true },
    status: {
      type: String,
      enum: ['ENROLLED', 'IN_PROGRESS', 'REVIEW_PENDING', 'COMPLETED'],
      default: 'ENROLLED',
      index: true,
    },
    startDate: { type: Date, default: Date.now },
    completedDate: { type: Date },
    submissions: [SubmissionSchema],
    certificateIssued: { type: Boolean, default: false, index: true },
    certificateId: { type: String, unique: true, sparse: true, index: true },
  },
  {
    timestamps: true,
  }
);

StudentInternshipSchema.index({ userId: 1, trackId: 1 });

export const StudentInternship: Model<IStudentInternship> =
  mongoose.models.StudentInternship ||
  mongoose.model<IStudentInternship>('StudentInternship', StudentInternshipSchema);

export default StudentInternship;
