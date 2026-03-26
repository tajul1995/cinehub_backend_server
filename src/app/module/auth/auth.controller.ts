

import { Request, Response } from "express";
import { catchAsync } from "../../shared/catchAsynce";
import { authService } from './auth.service';
import { sendResponce } from '../../shared/sendResponce';
import status from "http-status";
import { tokenUtils } from "../../utiles/token";
import AppError from "../../errorHelpers/AppError";
import { cookieUtils } from "../../utiles/cookies";
import { envVars } from "../../../config/env";
import { auth } from "../../lib/auth";

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
const changePassword=catchAsync(async(req:Request,res:Response)=>{
    const Payload=req.body
    const betterAuthSession=req.cookies["better-auth.session_token"]
    const result=await authService.changePassword(Payload,betterAuthSession)
    const {accessToken,refreshToken,token}=result
    tokenUtils.setAccessTokenCookie(res,accessToken)
    tokenUtils.setRefreshTokenCookie(res,refreshToken)
    tokenUtils.setBetterAuthSessionCookies(res,token as string)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Password changed successfully",
        data:result
    })
})
const logoutUser=catchAsync(async(req:Request,res:Response)=>{
    const betterAuthSession=req.cookies["better-auth.session_token"]
    const result=await authService.logoutUser(betterAuthSession)
    cookieUtils.deleteCookie(res,"better-auth.session_token",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    cookieUtils.deleteCookie(res,"refreshToken",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
        
    })
    cookieUtils.deleteCookie(res,"accessToken",{
        httpOnly:true,
        secure:true,
        sameSite:"none",
    })
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"User logged out successfully",
        data:result
    })
})
const forgetPassword=catchAsync(async(req:Request,res:Response)=>{
    const {email}=req.body
    await authService.forgetPassword(email)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Password reset email sent successfully"
    })

})
const resetPassword=catchAsync(async(req:Request,res:Response)=>{
    const {email,otp,newPassword}=req.body
    await authService.resetPassword(email,otp,newPassword)
    sendResponce(res,{
        httpStatuscode:status.OK,
        success:true,
        message:"Password reset successfully"
    })

})
const googleLogin=catchAsync(async(req:Request,res:Response)=>{
    const redirectPath = req.query.redirect || "/dashboard";
    console.log(redirectPath)

    const encodedRedirectPath = encodeURIComponent(redirectPath as string);

    const callbackURL = `${envVars.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

    res.render("googleRedirect", {
        callbackURL : callbackURL,
        betterAuthUrl : envVars.BETTER_AUTH_URL,
    })
    
})

const googleLoginSuccess=catchAsync(async(req:Request,res:Response)=>{
    const redirectPath = req.query.redirect as string || "/dashboard";

    const sessionToken = req.cookies["better-auth.session_token"];

    if(!sessionToken){
        return res.redirect(`${envVars.FORNTEND_URL}/login?error=oauth_failed`);
    }

    const session = await auth.api.getSession({
        headers:{
            "Cookie" : `better-auth.session_token=${sessionToken}`
        }
    })

    if (!session) {
        return res.redirect(`${envVars.FORNTEND_URL}/login?error=no_session_found`);
    }


    if(session && !session.user){
        return res.redirect(`${envVars.FORNTEND_URL}/login?error=no_user_found`);
    }

    const result = await authService.googleLoginSuccess(session);
    // console.log("auth",result)

    const {accessToken, refreshToken} = result;

    tokenUtils.setAccessTokenCookie(res, accessToken);
    tokenUtils.setRefreshTokenCookie(res, refreshToken);
//  ?redirect=//profile -> /profile

    const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
    const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";
    // console.log("path",finalRedirectPath)
    res.redirect(`${envVars.FORNTEND_URL}${finalRedirectPath}`);

})
const handleOAuthError=catchAsync(async(req:Request,res:Response)=>{
      const error = req.query.error as string || "oauth_failed";
    res.redirect(`${envVars.FORNTEND_URL}/login?error=${error}`);
})
   
export const AuthController={
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    forgetPassword,
    resetPassword,
    googleLogin,
    googleLoginSuccess,
    handleOAuthError
}