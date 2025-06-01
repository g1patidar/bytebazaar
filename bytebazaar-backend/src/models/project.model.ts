import { Schema, model, Document, Types } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  status: string;
  price: number;
  thumbnail: string;
  files: string[];
  createdBy: Types.ObjectId;
  reviews: {
    user: Types.ObjectId;
    rating: number;
    comment: string;
  }[];
}

const projectSchema = new Schema<IProject>({
  title: { type: String, required: true },
  description: String,
  category: String,
  status : {type : String, enum: ["planning", "completed", "inProgress" ]},
  price: { type: Number, required: true },
  thumbnail: String,
  files: [String], // S3/GCS links or local paths
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  reviews: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      rating: Number,
      comment: String,
    },
  ],
}, { timestamps: true });

export default model<IProject>('Project', projectSchema);
