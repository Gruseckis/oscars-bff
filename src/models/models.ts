import mongoose from 'mongoose';

export interface IUserModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  hashedPassword: string;
  email: string;
  dateOfBirth?: string;
  phoneNumber: string;
}

export interface SaveUserModel {
  firstName: string;
  lastName: string;
  hashedPassword: string;
  email: string;
  dateOfBirth?: string;
  phoneNumber: string;
}

export interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  password: string;
  passwordConfirmation: string;
  phoneNumber: string;
}
