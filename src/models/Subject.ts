import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IChapter {
  chapterNumber: number;
  title: string;
  slug: string;
}

export interface ISubject extends Document {
  _id: Types.ObjectId;
  examNodeId: Types.ObjectId;
  name: string;
  slug: string;
  chapters: IChapter[];
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const ChapterSchema = new Schema<IChapter>(
  {
    chapterNumber: { type: Number, required: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
  },
  { _id: false }
);

const SubjectSchema: Schema = new Schema(
  {
    examNodeId: { type: Schema.Types.ObjectId, ref: 'ExamNode', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, lowercase: true, trim: true },
    chapters: { type: [ChapterSchema], default: [] },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Compound Unique Index: Subject slug is unique within its parent ExamNode
SubjectSchema.index({ examNodeId: 1, slug: 1 }, { unique: true });
SubjectSchema.index({ examNodeId: 1, displayOrder: 1 });

export const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>('Subject', SubjectSchema);

export default Subject;
