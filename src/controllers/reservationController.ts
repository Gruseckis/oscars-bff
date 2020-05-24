import { dbController } from './dbController';
import express from 'express';
import { IRequestWithUser } from '../models/models';
import parseIso from 'date-fns/parseISO';
import AppError from '../errors/AppError';
import { differenceInCalendarDays, addDays, format } from 'date-fns';
import toArray from 'lodash/toArray';

export interface ReservationDate {
  date: string;
}
export interface ReservationCheckDates {
  dateFrom: string;
  dateTo: string;
}
export interface ReservationParams {
  id: string;
}

export class ReservationController {
  public async checkReservation(req: IRequestWithUser, res: express.Response) {
    try {
      const body: ReservationCheckDates = req.body;
      if (!body.dateFrom) {
        throw new AppError('Date from required', 400);
      }
      const dateFrom = parseIso(body.dateFrom);
      let dateTo = body.dateTo ? parseIso(body.dateTo) : parseIso(body.dateFrom);
      if (differenceInCalendarDays(dateTo, dateFrom) > 10) {
        dateTo = addDays(dateFrom, 10);
      }
      const dateCheck = await dbController.checkReservation(dateFrom, dateTo);
      res.status(200).send({ payload: { message: 'Available dates', dates: dateCheck } });
    } catch (error) {
      res.status(400).send({ error: { message: error.message, fields: [] } });
    }
  }

  public async makeReservation(req: IRequestWithUser, res: express.Response) {
    try {
      const body: ReservationDate = req.body;
      if (!body.date) {
        throw new AppError('Date requered', 400);
      }
      const reservationDate = parseIso(body.date);
      const reservationDateCheck = await dbController.checkReservation(
        reservationDate,
        reservationDate
      );

      if (toArray(reservationDateCheck)[0] > 5) {
        return res.status(400).send({
          error: {
            message: `${format(reservationDate, 'yyyy MMM dd')} is fully booked.`,
            fields: [],
          },
        });
      }
      const reservation = await dbController.saveReservation(reservationDate, req.user.id);
      if (reservation) {
        // TODO: send message to notification service
        res.status(200).send({ payload: { message: 'Reservation was successful', reservation } });
      }
    } catch (error) {
      res.status(400).send({ error: { message: error.message, fields: [] } });
    }
  }

  public async getPendingReservations(req: IRequestWithUser, res: express.Response) {
    const newReservations = await dbController.getNewReservations();
    res
      .status(200)
      .send({ payload: { message: 'Unconfirmed reservations', reservation: newReservations } });
  }

  public async aproveReservation(req: IRequestWithUser, res: express.Response) {
    if (!req.params.id) {
      return res.status(400).send({ error: { message: 'Reservation id required', fields: [] } });
    }
    const approvedReservation = await dbController.changeReservationStatus(
      req.params.id,
      'Confirmed'
    );
    res
      .status(200)
      .send({ payload: { message: 'Reservation approved', reservation: approvedReservation } });
    // TODO: Send notification to customer
  }

  public async markAsComplete(req: IRequestWithUser, res: express.Response) {
    if (!req.params.id) {
      return res.status(400).send({ error: { message: 'Reservation id required', fields: [] } });
    }

    const reservation = await dbController.changeReservationStatus(req.params.id, 'Completed');
    res.status(200).send({ payload: { message: 'Reservation completed', reservation } });
    // TODO: Send notification to customer
  }

  public async findItem(req: IRequestWithUser, res: express.Response) {
    const guid = req.query.guid as string;
    const businessId = req.query.businessId as string;
    console.log(guid, businessId);
    if (!guid && !businessId) {
      return res
        .status(400)
        .send({ error: { message: 'Guid or business id requered', fields: [] } });
    }
    const reservation = await dbController.findReservation(guid, businessId);

    res.status(200).send({ payload: { message: 'Reservation found', reservation } });
  }

  public async quoteRepair(req: IRequestWithUser, res: express.Response) {
    if (!req.body.price || !req.body.repairDuration) {
      return res
        .status(400)
        .send({ error: { message: 'Price and repaid duration required', fields: [] } });
    }
    const newQoute = await dbController.createQuote(req.body.price, req.body.repairDuration);
    const reservation = await dbController.addQuoteToReservation(req.params.id, newQoute._id);
    res.status(200).send({ payload: { message: 'Reservation quoted', reservation } });
    // TODO: Send notification to client
  }
}

export const reservationController = new ReservationController();
