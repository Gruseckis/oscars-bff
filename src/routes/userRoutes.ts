import express from 'express';
import { userController } from '../controllers/userController';

const router = express.Router();

router.get('/reservations', userController.getUserReservations);

export default router;
