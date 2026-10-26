import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type UserRole = 'STUDENT' | 'MENTOR' | 'COLLEGE_COORDINATOR' | 'ADMIN' | 'CREATOR';

export interface IUserBookmark {
  pdfId: Types.ObjectId;
  title: string;
  page: number;
  createdAt: Date;
}

export interface IUserReadingState {
  pdfId: Types.ObjectId;
  lastPage: number;
  totalPageCount?: number;
  updatedAt: Date;
}

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  passExpiresAt?: Date;
  purchasedPDFs: Types.ObjectId[];
  bookmarks: IUserBookmark[];
  lastRead: IUserReadingState[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true, index: true },
    email: { type: String, sparse: true, trim: true, lowercase: true },
    role: {
      type: String,
      enum: ['STUDENT', 'MENTOR', 'COLLEGE_COORDINATOR', 'ADMIN', 'CREATOR'],
      default: 'STUDENT',
    },
    passExpiresAt: { type: Date, default: null },
    purchasedPDFs: [{ type: Schema.Types.ObjectId, ref: 'PDFProduct' }],
    bookmarks: [
      {
        pdfId: { type: Schema.Types.ObjectId, ref: 'PDFProduct', required: true },
        title: { type: String, default: '' },
        page: { type: Number, default: 1 },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    lastRead: [
      {
        pdfId: { type: Schema.Types.ObjectId, ref: 'PDFProduct', required: true },
        lastPage: { type: Number, default: 1 },
        totalPageCount: { type: Number, default: 1 },
        updatedAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
