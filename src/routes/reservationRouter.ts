import express from 'express';
import { IRequestWithUser } from '../models/models';

const router = express.Router();

router.post('/check', (req: IRequestWithUser, res) => {
  console.log(req.user);
  res.send('check route works');
});

export default router;
