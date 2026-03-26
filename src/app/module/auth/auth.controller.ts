

import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsynce";
import { authService } from './auth.service';
import { sendResponce } from '../../shared/sendResponce';
import status from "http-status";

const registerUser=catchAsync(async(req:Request,res:Response)=>{
    const Payload=req.body
    const data=await authService.registerUser(Payload)
    sendResponce(res,{httpStatuscode:status.CREATED,success:true,data,message:"User registered successfully"})
})
const loginUser=catchAsync(async(req:Request,res:Response)=>{
    const Payload=req.body
    const data=await authService.loginUser(Payload)
    sendResponce(res,{httpStatuscode:status.OK,success:true,data,message:"User login successfully"})
    
})
export const AuthController={
    registerUser,
    loginUser
}