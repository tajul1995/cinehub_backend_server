import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsynce";
import status from "http-status";
import { sendResponce } from "../../shared/sendResponce";
import { bookingService } from "./booking.service";


const createBooking=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
    const user=req.user
    const result=await bookingService.createBooking(payload,user)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Booking created successfully",
        data:result
    })

    
})
export const bookingController={
    createBooking
}