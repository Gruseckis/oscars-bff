import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { IUserModel } from './models';

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, trim: true, required: true },
    lastName: { type: String, trim: true, required: true },
    hashedPassword: { type: String, trim: true, required: true },
    email: { type: String, trim: true, unique: true, required: true },
    dateOfBirth: { type: String, trim: true, required: false },
    phoneNumber: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUserModel>('save', async function (next) {
  if (this.hashedPassword) {
    this.hashedPassword = await bcrypt.hash(
      this.hashedPassword,
      parseInt(process.env.PASSWORD_HASHING_ROUNDS, 10)
    );
  }
  next();
});

const UserModel = mongoose.model('User', userSchema);

export default UserModel;
