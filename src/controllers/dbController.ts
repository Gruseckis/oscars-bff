import {
  RegistrationForm,
  SaveUserModel,
  LoginInformation,
  ReservationStatus,
} from '../models/models';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';
import ReservationModel from '../models/reservationModel';
import { nanoid } from 'nanoid';
import countBy from 'lodash/countBy';
import startOfDay from 'date-fns/startOfDay';
import QuoteModel from '../models/quoteModel';

export default class DataBaseController {
  private userModel = UserModel;
  private reservationModel = ReservationModel;
  private quoteModel = QuoteModel;

  public async findUserByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  public async saveUser(userData: RegistrationForm) {
    const model: SaveUserModel = {
      dateOfBirth: userData.dateOfBirth,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      hashedPassword: userData.password,
      phoneNumber: userData.phoneNumber,
    };
    return await this.userModel.create(model);
  }

  public async loginUser(loginInfo: LoginInformation) {
    const user = await this.findUserByEmail(loginInfo.email);
    if (!user) {
      return Promise.reject(null);
    }
    const match = await bcrypt.compare(loginInfo.password, user.hashedPassword);
    if (match) {
      return Promise.resolve(user);
    }
    return Promise.reject(null);
  }

  // reservation

  public async checkReservation(reservationDateFrom: Date, reservationDateTo: Date) {
    const reservations = await this.reservationModel
      .find({ reservationDate: { $gte: reservationDateFrom, $lte: reservationDateTo } })
      .sort({ reservationDate: 1 });
    const groupedDates = countBy(reservations, (item) => item.reservationDate);
    return groupedDates;
  }

  public async saveReservation(reservationDate: Date, customerId: string) {
    return await this.reservationModel.create({
      customerReference: this.generateCutomerReferemce(reservationDate),
      reservationDate,
      customer: customerId,
    });
  }

  public async getNewReservations() {
    const today = startOfDay(new Date());
    return await this.reservationModel
      .find({ $and: [{ reservationDate: { $gte: today } }, { status: 'New' }] })
      .sort({ reservationDate: 1 });
  }

  public async changeReservationStatus(reservationId: string, status: ReservationStatus) {
    return await this.reservationModel.findByIdAndUpdate(reservationId, { status }, { new: true });
  }

  public async findReservation(guid?: string, businessId?: string) {
    if (guid) {
      return await this.reservationModel.findById(guid).populate('customer').populate('quotes');
    }
    return await this.reservationModel
      .findOne({ customerReference: businessId })
      .populate('customer')
      .populate('quotes');
  }

  // Quotes
  public async getQuote(quoteId: string) {
    return await this.quoteModel.findById(quoteId);
  }

  public async createQuote(price: number, repairDuration: number) {
    return await this.quoteModel.create({
      price,
      repairDuration,
    });
  }

  public async confirmQoute(quoteId: string) {
    await this.quoteModel.findByIdAndUpdate(quoteId, { status: 'Accepted' }, { new: true });
    return this.reservationModel
      .findOneAndUpdate({ quotes: { $in: [quoteId] } }, { status: 'Qoute accepted' }, { new: true })
      .populate('customer')
      .populate('quotes');
  }

  public async addQuoteToReservation(reservationId: string, quoteId: string) {
    return await this.reservationModel
      .findByIdAndUpdate(
        reservationId,
        { $push: { quotes: quoteId }, status: 'Quoted' },
        { new: true }
      )
      .populate('customer')
      .populate('quotes');
  }

  // User
  public async getUserReservations(userId: string) {
    return await this.reservationModel.find({ customer: userId }).populate('quotes');
  }

  private generateCutomerReferemce(date: Date): string {
    return `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}-${nanoid(4)}`;
  }
}

export const dbController = new DataBaseController();
