

import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsynce";
import { authService } from './auth.service';
import { sendResponce } from '../../shared/sendResponce';
import status from "http-status";
import { tokenUtils } from "../../utiles/token";
import AppError from "../../errorHelpers/AppError";

const registerUser=catchAsync(async(req:Request,res:Response)=>{
    const Payload=req.body
    const result=await authService.registerUser(Payload)
     const {accessToken,refreshToken,token,...rest}=result
    tokenUtils.setAccessTokenCookie(res,accessToken)
    tokenUtils.setRefreshTokenCookie(res,refreshToken)
    tokenUtils.setBetterAuthSessionCookies(res,token as string)
    sendResponce(res,{
        httpStatuscode:status.CREATED,
        success:true,
        message:"User registered successfully",
        data:{
            accessToken,
            refreshToken,
            token,
            ...rest
        }
    })
})
const loginUser=catchAsync(async(req:Request,res:Response)=>{
    const Payload=req.body
    const result=await authService.loginUser(Payload)
    const {accessToken,refreshToken,token,...rest}=result
     tokenUtils.setAccessTokenCookie(res,accessToken)
    tokenUtils.setRefreshTokenCookie(res,refreshToken)
    tokenUtils.setBetterAuthSessionCookies(res,token)
    sendResponce(res,{httpStatuscode:status.OK,success:true,data:{accessToken,
            refreshToken,
            token,
            ...rest},message:"User login successfully"})
    
})
const getMe=catchAsync(async(req:Request,res:Response)=>{
    const user=req.user
    const result=await authService.getMe(user.userId)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"User fetched successfully",
        data:result
    })
})
const getNewToken=async(req:Request,res:Response)=>{
    const refreshToken=req.cookies.refreshToken
    const betterAuthSession=req.cookies["better-auth.session_token"]
    if(!refreshToken || !betterAuthSession){
       throw new AppError(status.UNAUTHORIZED,"Unauthorized")
    }
    const result= await authService.getNewToken(refreshToken,betterAuthSession)
    // console.log(result)
    const {accessToken,refreshToken:refreshTokenCookie,token}=result
    tokenUtils.setAccessTokenCookie(res,accessToken)
    tokenUtils.setRefreshTokenCookie(res,refreshTokenCookie)
    tokenUtils.setBetterAuthSessionCookies(res,token)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"User logged in successfully",
        data:{
            accessToken,
            refreshToken:refreshTokenCookie,
            token
            
        }
    })
  
    
}
export const AuthController={
    registerUser,
    loginUser,
    getMe,
    getNewToken
}