import { Schema, model, Document, Types } from 'mongoose';

export interface IOrder extends Document {
  buyer: Types.ObjectId;
  project: Types.ObjectId;
  amount: number;
  status: 'pending' | 'completed' | 'cancelled';
  purchasedAt: Date;
}

const orderSchema = new Schema<IOrder>({
  buyer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: Schema.Types.ObjectId, ref: 'Project', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  purchasedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

// Add index for better query performance
orderSchema.index({ buyer: 1, project: 1 }, { unique: true });
orderSchema.index({ purchasedAt: -1 });
orderSchema.index({ status: 1 });

export default model<IOrder>('Order', orderSchema);
