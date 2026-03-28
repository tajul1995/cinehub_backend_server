import { IRequestUser } from "../../interfaces/user.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload } from "./booking.interface";

const createBooking=async(payload:IBookAppointmentPayload,user:IRequestUser)=>{
    return await prisma.booking.create({data:{movieId:payload.movieId,userId:user.userId}})
    
}

export const bookingService={
    createBooking
}