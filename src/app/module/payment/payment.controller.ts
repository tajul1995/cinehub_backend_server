 
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import status from "http-status";
import { catchAsync } from "../../shared/catchAsynce";
import { envVars } from "../../../config/env";
import { stripe } from "../../../config/stripe.config";
import { PaymentService } from "./payment.service";
import { sendResponce } from "../../shared/sendResponce";



const handleStripeWebhookEvent = catchAsync(async (req : Request, res : Response) => {
    const signature = req.headers['stripe-signature'] as string
    const webhookSecret = envVars.STRIPE.STRIPE_WEBHOOK_SECRET;

    if(!signature || !webhookSecret){
        console.error("Missing Stripe signature or webhook secret");
        return res.status(status.BAD_REQUEST).json({message : "Missing Stripe signature or webhook secret"})
    }

    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, signature, webhookSecret);
    } catch (error : any) {
        console.error("Error processing Stripe webhook:", error);
        return res.status(status.BAD_REQUEST).json({message : "Error processing Stripe webhook"})
    }

    try {
        const result = await PaymentService.handlerStripeWebhookEvent(event);

        sendResponce(res, {
            httpStatuscode : status.OK,
            success : true,
            message : "Stripe webhook event processed successfully",
            data : result
        })
    } catch (error) {
        console.error("Error handling Stripe webhook event:", error);
        sendResponce(res, {
            httpStatuscode : status.INTERNAL_SERVER_ERROR,
            success : false,
            message : "Error handling Stripe webhook event"
        })
    }
})

const totalPayment = catchAsync(async (req : Request, res : Response) => {
    const result = await PaymentService.totalPayment();
    sendResponce(res, {
        httpStatuscode : status.OK,
        success : true,
        message : "Total payment retrieved successfully",
        data : result
    })
})
export const PaymentController = {
    handleStripeWebhookEvent,
    totalPayment
}