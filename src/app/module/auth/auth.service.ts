import status from "http-status";
import AppError from "../../errorHelpers/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utiles/token";
import { ChangePasswordPaytload, LoginPayload, RegisterUserPayload } from "./auth.interface";
import { jwtUtils } from "../../utiles/jwt";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../../config/env";
import { UserStatus } from "../../../generated/prisma/enums";



const registerUser=async(payload:RegisterUserPayload)=>{
    const userData= await auth.api.signUpEmail({
        body:{
            name:payload.name,
            email:payload.email,
            password:payload.password
        }
    })
    if(!userData.user){
        throw new Error("User not found")
    }
    const accessToken= tokenUtils.getAccessToken({
        id:userData.user.id,
        email:userData.user.email,
        role:userData.user.role,
        name:userData.user.name,
        status:userData.user.status,
        isDeleted:userData.user.isDeleted,
        emailVerified:userData.user.emailVerified,
        

    })
    const refreshToken=tokenUtils.getRefreshToken({
        id:userData.user.id,
        email:userData.user.email,
        role:userData.user.role,
        name:userData.user.name,
        status:userData.user.status,
        isDeleted:userData.user.isDeleted,
        emailVerified:userData.user.emailVerified,
    })
    return {...userData,accessToken,refreshToken}
    
}
const loginUser= async(payload:LoginPayload)=>{
    const userData=await auth.api.signInEmail({
        body:{
            email:payload.email,
            password:payload.password
        }
    })
    if(userData.user.status==="DELETED"){
        throw new Error("User is deleted")
    }
    if(userData.user.status==="BLOCKED"){
        throw new Error("User is blocked")
    }
     const accessToken= tokenUtils.getAccessToken({
        id:userData.user.id,
        email:userData.user.email,
        role:userData.user.role,
        name:userData.user.name,
        status:userData.user.status,
        isDeleted:userData.user.isDeleted,
        emailVerified:userData.user.emailVerified,
        

    })
    const refreshToken=tokenUtils.getRefreshToken({
        id:userData.user.id,
        email:userData.user.email,
        role:userData.user.role,
        name:userData.user.name,
        status:userData.user.status,
        isDeleted:userData.user.isDeleted,
        emailVerified:userData.user.emailVerified,
    })
    return {...userData,accessToken,refreshToken}
}
const getMe=async(id:string)=>{
    const userExists=await prisma.user.findUnique({where:{id}})
    if(!userExists){
        throw new AppError(status.NOT_FOUND,"User not found")
    }
return userExists
}
const getNewToken=async(refreshToken:string,sessionToken:string)=>{
    const isSessionTokenExists=await prisma.session.findUnique({
        where:{token:sessionToken},
        include:{user:true}
        
    })
    if(!isSessionTokenExists){
        throw new AppError(status.UNAUTHORIZED,"Unauthorized")
    }
    const verifiedRefreshToken= jwtUtils.verifyToken(refreshToken,envVars.REFRESH_TOKEN_SECRET)
    // console.log( verifiedRefreshToken)
    if(!verifiedRefreshToken.success && verifiedRefreshToken.error){
        throw new AppError(status.UNAUTHORIZED,verifiedRefreshToken.message)
    }
    const userData=verifiedRefreshToken.data as JwtPayload
    // console.log("userData",userData)
    const newAccessToken= tokenUtils.getAccessToken({
        id:userData.id,
        email:userData.email,
        role:userData.role,
        name:userData.name,
        status:userData.status,
        isDeleted:userData.isDeleted,
        emailVerified:userData.emailVerified,
        

    })
    const neweRefreshToken=tokenUtils.getRefreshToken({
        id:userData.id,
        email:userData.email,
        role:userData.role,
        name:userData.name,
        status:userData.status,
        isDeleted:userData.isDeleted,
        emailVerified:userData.emailVerified,
    })

    const {token}= await prisma.session.update({
        where:{token:sessionToken},
        data:{token:sessionToken,
            expiresAt: new Date(Date.now() + 60 * 60 * 60 * 24 * 1000),
            updatedAt:new Date()

         },
    })


    return {
        accessToken:newAccessToken,
        refreshToken:neweRefreshToken,
        token
    }

}
const changePassword=async(payload:ChangePasswordPaytload,sessionToken:string)=>{
    const session = await auth.api.getSession({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })

    if(!session){
        throw new AppError(status.UNAUTHORIZED, "Invalid session token");
    }

    const {currentPassword, newPassword} = payload;

    const result = await auth.api.changePassword({
        body :{
            currentPassword,
            newPassword,
            revokeOtherSessions: true,
        },
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })
   
    const accessToken= tokenUtils.getAccessToken({
        id:session.user.id,
        email:session.user.email,
        role:session.user.role,
        name:session.user.name,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified,
        

    })
    const refreshToken=tokenUtils.getRefreshToken({
        id:session.user.id,
        email:session.user.email,
        role:session.user.role,
        name:session.user.name,
        status:session.user.status,
        isDeleted:session.user.isDeleted,
        emailVerified:session.user.emailVerified,
    })

    return {
        ...result,
        accessToken,
        refreshToken
    }
}
 
const logoutUser= async(sessionToken:string)=>{
   return await auth.api.signOut({
        headers : new Headers({
            Authorization : `Bearer ${sessionToken}`
        })
    })
}
const forgetPassword=async(email:string)=>{
    const isUserExists= await prisma.user.findUnique({
        where:{email}
    })
    if(!isUserExists){
        throw new AppError(status.NOT_FOUND,"User not found")
    }
    
    if(isUserExists.status===UserStatus.BLOCKED || isUserExists.status===UserStatus.DELETED){
        throw new AppError(status.UNAUTHORIZED,"User is blocked or deleted")
    }
     await auth.api.requestPasswordResetEmailOTP({
        body:{email}
    })
    
}
const resetPassword=async(email:string,otp:string,newPassword:string)=>{
    const isUserExists= await prisma.user.findUnique({
        where:{email}
    })
    if(!isUserExists){
        throw new AppError(status.NOT_FOUND,"User not found")
    }
    
    if(isUserExists.status===UserStatus.BLOCKED || isUserExists.status===UserStatus.DELETED){
        throw new AppError(status.UNAUTHORIZED,"User is blocked or deleted")
    }
     await auth.api.resetPasswordEmailOTP({
        body:{email,otp,password:newPassword}
    })
   
    await prisma.session.deleteMany({
        where:{userId:isUserExists.id}
    })
}
export const authService={
    registerUser,
    loginUser,
    getMe,
    getNewToken,
    changePassword,
    logoutUser,
    forgetPassword,
    resetPassword
}