import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface ICategory extends Document {
  sectorId: Types.ObjectId;
  name: string;
  slug: string;
  shortCode: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema: Schema = new Schema(
  {
    sectorId: { type: Schema.Types.ObjectId, ref: 'Sector', required: true, index: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    shortCode: { type: String, required: true, uppercase: true, trim: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const Category: Model<ICategory> =
  mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
