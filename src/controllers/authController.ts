import express from 'express';

export default class AuthController {
  public static async register(req: express.Request, res: express.Response) {
    res.status(200).send({ payload: { message: 'Successfully registered' } });
  }
}
