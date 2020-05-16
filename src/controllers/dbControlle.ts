import { RegistrationForm, SaveUserModel, LoginInformation } from '../models/models';
import UserModel from '../models/userModel';
import bcrypt from 'bcrypt';

export default class DataBaseController {
  private userModel = UserModel;

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
}
