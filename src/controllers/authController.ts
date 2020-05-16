import express, { NextFunction } from 'express';
import DataBaseController from './dbControlle';
import {
  RegistrationForm,
  LoginInformation,
  IUserModel,
  DecodedToken,
  IRequestWithUser,
} from '../models/models';
import jwt from 'jsonwebtoken';

export class AuthController {
  private dbController: DataBaseController;

  constructor() {
    this.dbController = new DataBaseController();
  }
  public async register(req: express.Request, res: express.Response) {
    const reqBody: RegistrationForm = req.body;
    const duplicate = await this.dbController.findUserByEmail(reqBody.email);
    if (duplicate) {
      return res.status(400).send({ error: { message: 'User already exists', fields: ['email'] } });
    }
    if (reqBody.password !== reqBody.passwordConfirmation) {
      return res.status(400).send({
        error: { message: 'Password do not match', fields: ['password', 'passwordConfirmation'] },
      });
    }
    const user = await this.dbController.saveUser(reqBody);

    res.status(201).send({ payload: { message: 'Successfully registered', user } });
  }

  public async login(req: express.Request, res: express.Response) {
    try {
      const loginInfo: LoginInformation = req.body;
      if (!loginInfo.email || !loginInfo.password) {
        throw new Error('Wrong cridentials');
      }
      const user: IUserModel = await this.dbController.loginUser(loginInfo);
      const token = jwt.sign(
        {
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
          },
        },
        process.env.JWT_SECRET,
        {
          expiresIn: process.env.JWT_EXPIRY,
        }
      );
      res
        .status(200)
        .send({ payload: { message: 'Logged in successfully', token: `Bearer ${token}` } });
    } catch (error) {
      res
        .status(400)
        .send({ error: { message: 'Wrong user cridentials', fields: ['email', 'password'] } });
    }
  }

  public async authentication(req: IRequestWithUser, res: express.Response, next: NextFunction) {
    const { authorization } = req.headers;
    let token;
    if (authorization) {
      [, token] = authorization.split(' ');
    }
    if (token) {
      const decodedToken: DecodedToken = jwt.verify(token, process.env.JWT_SECRET) as DecodedToken;
      if (decodedToken && decodedToken.data && decodedToken.data.email) {
        const user = await this.dbController.findUserByEmail(decodedToken.data.email);
        if (user) {
          req.user = user;
          return next();
        }
      }
    }
    res.status(401).send({ error: { message: 'Authentication failed', fields: [] } });
  }
}

export const authController = new AuthController();
