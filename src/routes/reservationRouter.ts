import express from 'express';
import { reservationController } from '../controllers/reservationController';

const router = express.Router();

router.post('/:id/quote', reservationController.quoteRepair);

router.get('/:id/approve', reservationController.aproveReservation);

router.post('/:id/complete');

router.get('/find', reservationController.findItem);

router.get('/new', reservationController.getPendingReservations);

router.post('/check', reservationController.checkReservation);

router.post('/reserve', reservationController.makeReservation);

export default router;
