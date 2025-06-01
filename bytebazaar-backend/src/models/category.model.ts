import { Schema, model, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  description?: string;
}

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true },
  description: String,
});

export default model<ICategory>('Category', categorySchema);
