import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type UserRole = 'STUDENT' | 'ADMIN' | 'CREATOR';

export interface IUser extends Document {
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  passExpiresAt?: Date;
  purchasedPDFs: Types.ObjectId[];
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
      enum: ['STUDENT', 'ADMIN', 'CREATOR'],
      default: 'STUDENT',
    },
    passExpiresAt: { type: Date, default: null },
    purchasedPDFs: [{ type: Schema.Types.ObjectId, ref: 'PDFProduct' }],
  },
  {
    timestamps: true,
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
