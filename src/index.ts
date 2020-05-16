import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/authRouter';
import reservationRouter from './routes/reservationRouter';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { authController } from './controllers/authController';

dotenv.config();
const port = process.env.PORT;
const app = express();
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// define a route handler for the default home page

// Routeing
app.use('/api/auth', authRouter);
app.use('/api/reservation', authController.authentication.bind(authController), reservationRouter);

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
