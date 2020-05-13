import express, { NextFunction } from 'express';
import DataBaseController from './dbControlle';
import { RegistrationForm } from '../models/models';

export default class AuthController {
  private dbController: DataBaseController;

  constructor() {
    this.dbController = new DataBaseController();
  }
  public async register(req: express.Request, res: express.Response, next: NextFunction) {
    const reqBody: RegistrationForm = req.body;
    console.log(reqBody);
    const duplicate = await this.dbController.checkForDuplicates(reqBody.email);
    if (duplicate) {
      return res.status(500).send({ error: { message: 'User already exists', field: 'email' } });
    }
    if (reqBody.password !== reqBody.passwordConfirmation) {
      return res
        .status(500)
        .send({ error: { message: 'Password do not match', field: 'password' } });
    }
    const user = await this.dbController.saveUser(reqBody);

    res.status(201).send({ payload: { message: 'Successfully registered', user } });
  }
}
