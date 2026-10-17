import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISector extends Document {
  name: string;
  slug: string;
  icon?: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SectorSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    icon: { type: String, default: 'GraduationCap' },
    displayOrder: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const Sector: Model<ISector> =
  mongoose.models.Sector || mongoose.model<ISector>('Sector', SectorSchema);

export default Sector;
