import status from "http-status";
import { envVars } from "../../../config/env";
import { stripe } from "../../../config/stripe.config";
import AppError from "../../errorHelpers/AppError";
import { IRequestUser } from "../../interfaces/user.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload, IUpdateBookingPayload } from "./booking.interface";
import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma/enums";
import { v7 as uuidv7 } from "uuid";

const createBooking=async(payload:IBookAppointmentPayload,user:IRequestUser)=>{
    const movieData=await prisma.movie.findUnique({where:{id:payload.movieId}})


     const result = await prisma.$transaction(async (tx) => {
        const bookingData = await tx.booking.create({
            data : {
                movieId : payload.movieId,
                userId : user.userId,
                
            }
        });

        // await tx.doctorSchedules.update({
        //     where : {
        //         doctorId_scheduleId:{
        //             doctorId : payload.doctorId,
        //             scheduleId : payload.scheduleId,
        //         }
        //     },
        //     data : {
        //         isBooked : true,
        //     }
        // });

        //TODO : Payment Integration will be here

        const transactionId = String(uuidv7());

        const paymentData = await tx.payment.create({
            data : {
                bookingId : bookingData.id,
                amount : movieData?.price || 0,
                transactionId
            }
        });
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items :[
                {
                    price_data:{
                        currency:"bdt",
                        product_data:{
                            name : `Booking for ${movieData?.movieName}`,
                        },
                        unit_amount : movieData?.price ? movieData.price * 100 : 0,
                    },
                    quantity : 1,
                }
            ],
            metadata:{
                bookingId : bookingData.id,
                paymentId : paymentData.id,
            },

            success_url: `${envVars.FORNTEND_URL}/dashboard/payment/payment-success`,

            // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
            cancel_url: `${envVars.FORNTEND_URL}/dashboard/appointments`,
        })

        return {
            bookingData,
            paymentData,
            paymentUrl : session.url,
        };
    });

   
    return {
        booking : result.bookingData,
        payment : result.paymentData,
        paymentUrl : result.paymentUrl,
    };
    
}
const getSingleBooking=async(userId:string)=>{
    return await prisma.booking.findFirst({where:{userId:userId}})
}
const updateBooking=async(payload:IUpdateBookingPayload,user:IRequestUser)=>{
    const booking = await prisma.booking.findFirst({where:{userId:user.userId}});
    if(!booking){
        throw new AppError(status.NOT_FOUND, "Booking not found");
    }
    return await prisma.booking.update({where:{id:booking.id},data:payload})
    
}
const initiatePayment = async (bookingId: string, user : IRequestUser) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
        }
    });

    const bookingData = await prisma.booking.findUniqueOrThrow({
        where: {
            id: bookingId,
             userId: userData.id,
        },
        include: {
            
            payment : true,
        }
    });
    const movieData=await prisma.movie.findUnique({where:{id:bookingData.movieId}})
    if(!bookingData){
        throw new AppError(status.NOT_FOUND, "Appointment not found");
    }

    if(!bookingData.payment || !bookingData.payment){
        throw new AppError(status.NOT_FOUND, "Payment data not found for this appointment");
    }

    if(bookingData.payment?.status === PaymentStatus.PAID){
        throw new AppError(status.BAD_REQUEST, "Payment already completed for this appointment");
    };

    if(bookingData.status === AppointmentStatus.CANCELED){
        throw new AppError(status.BAD_REQUEST, "Appointment is canceled");
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: 'payment',
        line_items: [
            {
                price_data: {
                    currency: "bdt",
                    product_data: {
                        name: `Booking for ${movieData?.movieName}`,
                    },
                    unit_amount: movieData?.price ? movieData.price * 100 : 0,
                },
                quantity: 1,
            }
        ],
        metadata: {
            bookingId: bookingData.id,
            paymentId: bookingData.payment.id,
        },

        success_url: `${envVars.FORNTEND_URL}/dashboard/paymentHistory`,

        // cancel_url: `${envVars.FRONTEND_URL}/dashboard/payment/payment-failed`,
        cancel_url: `${envVars.FORNTEND_URL}?error=payment_cancelled`,
    })

    return {
        paymentUrl: session.url,
    }
}
export const bookingService={
    createBooking,
    getSingleBooking,
    updateBooking,
    initiatePayment
}