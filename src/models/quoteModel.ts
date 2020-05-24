import mongoose from 'mongoose';
import { IQuoteModel } from './models';

const quoteSchema = new mongoose.Schema(
  {
    price: { type: Number, required: true },
    repairDuration: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ['Active', 'Accepted', 'Declined'],
      default: 'Active',
    },
  },
  {
    timestamps: true,
  }
);

const QuoteModel = mongoose.model<IQuoteModel>('Quote', quoteSchema);

export default QuoteModel;
