import { globalErrorHandlers } from './app/middlewares/globalErrorHandeler';
import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";

import { indexRoute } from './app/routes';
import { notFound } from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { auth } from './app/lib/auth';
import path from 'path';
const app=express();
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.use("/api/auth", toNodeHandler(auth))
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser())
 app.use('/api/v1',indexRoute)
// Basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
app.use(globalErrorHandlers)
app.use(notFound)
export default app