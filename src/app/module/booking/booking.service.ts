import { IRequestUser } from "../../interfaces/user.interface";
import { prisma } from "../../lib/prisma";
import { IBookAppointmentPayload, IUpdateBookingPayload } from "./booking.interface";

const createBooking=async(payload:IBookAppointmentPayload,user:IRequestUser)=>{
    return await prisma.booking.create({data:{movieId:payload.movieId,userId:user.userId}})
    
}
const getSingleBooking=async(userId:string)=>{
    return await prisma.booking.findUnique({where:{userId:userId}})
}
const updateBooking=async(payload:IUpdateBookingPayload,user:IRequestUser)=>{
return await prisma.booking.update({where:{userId:user.userId},data:payload})
    
}
export const bookingService={
    createBooking,
    getSingleBooking,
    updateBooking
}