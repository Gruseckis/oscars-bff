import express from 'express';
import AuthController from '../controllers/authController';

const authController = new AuthController();

const router = express.Router();

router.post('/register', authController.register.bind(authController));

export default router;
