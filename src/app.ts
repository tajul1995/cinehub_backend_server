import { globalErrorHandlers } from './app/middlewares/globalErrorHandeler';
import express, { Request, Response } from 'express';

import { indexRoute } from './app/routes';
import { notFound } from './app/middlewares/notFound';
const app=express();
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
 app.use('/api/v1',indexRoute)
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
app.use(globalErrorHandlers)
app.use(notFound)
export default app