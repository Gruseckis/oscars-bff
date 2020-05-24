import express from 'express';
import { reservationController } from '../controllers/reservationController';

const router = express.Router();

router.post('/:id/quote', reservationController.quoteRepair.bind(reservationController));

router.get('/:id/approve', reservationController.aproveReservation.bind(reservationController));

router.get('/find', reservationController.findItem.bind(reservationController));

router.get('/new', reservationController.getPendingReservations.bind(reservationController));

router.post('/check', reservationController.checkReservation.bind(reservationController));

router.post('/reserve', reservationController.makeReservation.bind(reservationController));

export default router;
