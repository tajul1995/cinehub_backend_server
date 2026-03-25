import express, { Request, Response } from 'express';

import { indexRoute } from './app/routes';
const app=express();
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
 app.use('/api/v1',indexRoute)
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
export default app