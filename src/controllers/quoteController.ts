import { IRequestWithUser } from '../models/models';
import express from 'express';
import { dbController } from './dbController';

export class QuoteController {
  public async getQuote(req: IRequestWithUser, res: express.Response) {
    if (!req.params.id) {
      return res.status(400).send({ error: { message: 'Quote guid required', fields: [] } });
    }

    const quote = await dbController.getQuote(req.params.id);

    if (!quote) {
      return res.status(400).send({ error: { message: 'Quote does not exists', fields: [] } });
    }

    res.status(200).send({ payload: { message: 'Quote found', quote } });
  }

  public async confirmQuote(req: IRequestWithUser, res: express.Response) {
    if (!req.params.id) {
      return res.status(400).send({ error: { message: 'Quote guid required', fields: [] } });
    }
    const reservation = await dbController.confirmQoute(req.params.id);

    res.status(200).send({ payload: { message: 'Quote updated', reservation } });
    // const quote;
  }
}

export const quoteController = new QuoteController();
