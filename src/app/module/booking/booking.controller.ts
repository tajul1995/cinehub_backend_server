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
const getSingleBooking=catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    const result=await bookingService.getSingleBooking(user.userId)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"get single booking",
        data:result
    })
    
})
const updateBooking=catchAsync(async(req:Request,res:Response)=>{
        const payload=req.body
        const user=req.user
        
        const result=await bookingService.updateBooking(payload,user)
        sendResponce(res,{
            httpStatuscode:status.OK,
            success:true,
            message:"Booking updated successfully",
            data:result
        })
    
})
const initiatePayment = catchAsync(async (req: Request, res: Response) => {
    const bookingId = req.params.id;
    const user = req.user;
    const paymentInfo = await bookingService.initiatePayment(bookingId as string, user);

    sendResponce(res, {
        success: true,
        httpStatuscode: status.OK,
        message: 'Payment initiated successfully',
        data: paymentInfo
    });
});

export const bookingController={
    createBooking,
    getSingleBooking,
    updateBooking,
    initiatePayment
}