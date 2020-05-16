import mongoose from 'mongoose';
import express from 'express';

export interface IUserModel extends mongoose.Document {
  firstName: string;
  lastName: string;
  hashedPassword: string;
  email: string;
  dateOfBirth?: string;
  phoneNumber: string;
}

export interface IRequestWithUser extends express.Request {
  user: IUserModel;
}

export interface LoginInformation {
  email: string;
  password: string;
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

export interface UserTokenData {
  firstName: string;
  lastName: string;
  email: string;
}

export interface DecodedToken {
  data: UserTokenData;
}
