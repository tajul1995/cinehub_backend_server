import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsynce";
import { sendResponce } from "../../shared/sendResponce";
import status from "http-status";
import { reviewService } from "./review.service";

const createReview=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
    const user=req.user
    const result=await reviewService.createReview(payload,user)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Review created successfully",
        data:result
    })

})
const getReview=catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    const result=await reviewService.getReview(user)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"get all review",
        data:result
    })
})
const updateReview=catchAsync(async(req:Request,res:Response)=>{
    const payload=req.body
    const user=req.user
    const result=await reviewService.updateReview(payload,user)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Review updated successfully",
        data:result
    })
    
})
export const reviewController={
    createReview,
    getReview,
    updateReview
}