import express from 'express';
import bodyParser from 'body-parser';
import authRouter from './routes/authRouter';
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// define a route handler for the default home page

// Routeing
app.use('/api/auth', authRouter);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
