import { globalErrorHandlers } from './app/middlewares/globalErrorHandeler';
import express, { Request, Response } from 'express';
import { toNodeHandler } from "better-auth/node";
import cors from "cors"

import { indexRoute } from './app/routes';
import { notFound } from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';
import { auth } from './app/lib/auth';
import path from 'path';
import { envVars } from './config/env';
import { PaymentController } from './app/module/payment/payment.controller';
const app=express();
app.set("view engine", "ejs");
app.set("views", path.resolve(process.cwd(), `src/app/templates`));
app.post("/webhook", express.raw({ type: "application/json" }), PaymentController.handleStripeWebhookEvent);
app.use(cors({
    origin : [envVars.FORNTEND_URL, envVars.BETTER_AUTH_URL, "http://localhost:3000", "http://localhost:5000"],
    credentials : true,
    methods : ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders : ["Content-Type", "Authorization"]
}))
app.use("/api/auth", toNodeHandler(auth))
app.use(express.urlencoded({ extended: true }));


app.use(express.json());
app.use(cookieParser())
 app.use('/api/v1',indexRoute)

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript + Express!');
});
app.use(globalErrorHandlers)
app.use(notFound)
export default app