import express from 'express';
import { quoteController } from '../controllers/quoteController';

const router = express.Router();

router.get('/:id', quoteController.getQuote);

router.post('/:id/accept', quoteController.confirmQuote);

export default router;
