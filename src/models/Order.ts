import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export type OrderType = 'SINGLE_PDF' | 'ALL_ACCESS_PASS';
export type OrderStatus = 'PENDING' | 'SUCCESS' | 'FAILED';

export interface IOrder extends Document {
  orderNumber: string;
  userId: Types.ObjectId;
  orderType: OrderType;
  pdfProductId?: Types.ObjectId;
  amount: number;
  status: OrderStatus;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
  {
    orderNumber: { type: String, required: true, unique: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    orderType: {
      type: String,
      enum: ['SINGLE_PDF', 'ALL_ACCESS_PASS'],
      default: 'SINGLE_PDF',
      required: true,
    },
    pdfProductId: { type: Schema.Types.ObjectId, ref: 'PDFProduct', default: null },
    amount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCESS', 'FAILED'],
      default: 'PENDING',
      index: true,
    },
    razorpayOrderId: { type: String, default: null, index: true },
    razorpayPaymentId: { type: String, default: null },
    customerName: { type: String },
    customerPhone: { type: String },
    customerEmail: { type: String },
  },
  {
    timestamps: true,
  }
);

export const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
