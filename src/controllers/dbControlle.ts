import { RegistrationForm, SaveUserModel } from '../models/models';
import UserModel from '../models/userModel';

export default class DataBaseController {
  private userModel = UserModel;

  public async checkForDuplicates(email: string) {
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
    const response = await this.userModel.create(model);
  }
}
