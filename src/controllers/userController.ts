import { IRequestWithUser } from '../models/models';
import express from 'express';
import { dbController } from './dbController';

export class UserController {
  public async getUserReservations(req: IRequestWithUser, res: express.Response) {
    const reservations = await dbController.getUserReservations(req.user.id);
    res.status(200).send({ payload: { message: 'User reservations found', reservations } });
  }
}

export const userController = new UserController();
