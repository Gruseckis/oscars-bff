import mongoose, { Schema } from 'mongoose';
import { IReservationModel } from './models';

const reservationModel = new Schema(
  {
    customerReference: { type: String, required: true },
    reservationDate: { type: Date, required: true },
    status: {
      type: String,
      required: true,
      enum: [
        'New',
        'Confirmed',
        'Inspecting',
        'Quoted',
        'Qoute accepted',
        'Repairs',
        'Billed',
        'Completed',
      ],
      default: 'New',
    },
    customer: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
    quotes: [{ type: mongoose.Types.ObjectId, ref: 'Quote' }],
  },
  {
    timestamps: true,
  }
);

const ReservationModel = mongoose.model<IReservationModel>('Reservation', reservationModel);

export default ReservationModel;
