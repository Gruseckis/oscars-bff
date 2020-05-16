import express from 'express';
import AppError from '../errors/AppError';

const defaultErrorHandler = (error: AppError, req: express.Request, res: express.Response) => {
  res.status(error.status).send({ error: error.message });
};

export default defaultErrorHandler;
