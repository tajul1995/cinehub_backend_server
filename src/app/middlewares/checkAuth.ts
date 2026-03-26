import { NextFunction, Request, Response } from "express"
import { Role, UserStatus } from "../../generated/prisma/enums"
import { cookieUtils } from "../utiles/cookies"
import AppError from "../errorHelpers/AppError"
import status from "http-status"
import { prisma } from "../lib/prisma"
import { jwtUtils } from "../utiles/jwt"
import { envVars } from "../../config/env"




export const checkAuth=(...authRoles:Role[])=>async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const sessionToken= cookieUtils.getCookie(req,"better-auth.session_token")
        if(!sessionToken) {
            throw new AppError(status.UNAUTHORIZED,"Unauthorized")
        }
        if(sessionToken){
            const sessionExists=await prisma.session.findFirst({
                where:{token:sessionToken,
                    expiresAt:{gte:new Date()}
                },
                include:{user:true}
                
            })
            if(sessionExists){
                const user=sessionExists.user
                const now=new Date()
                const createAt=new Date(sessionExists.createdAt)
                const expireAt=new Date(sessionExists.expiresAt)
                const sessionLifeTime=expireAt.getTime()-createAt.getTime()
                const timeDiff=now.getTime()-createAt.getTime()
                const percentRemaining=(timeDiff/sessionLifeTime)*100
                if(percentRemaining<20){
                    res.setHeader("X-Session-Remaining",`${percentRemaining}%`)
                    res.setHeader("X-Session-Expires",`${expireAt.getTime()}`)
                    res.setHeader("X-Session-TimeLeft",`${sessionLifeTime-timeDiff}`)
                }
                if(user.status===UserStatus.BLOCKED || user.status===UserStatus.DELETED){
                    throw new AppError(status.UNAUTHORIZED,"Unauthorized")
                }
                if (user.isDeleted) {
                    throw new AppError(status.UNAUTHORIZED, 'Unauthorized access! User is deleted.');
                }

                if (authRoles.length > 0 && !authRoles.includes(user.role)) {
                    throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
                }

                req.user = {
                    userId : user.id,
                    role : user.role,
                    email : user.email,
                }
                
            }

        }
        const accessToken=cookieUtils.getCookie(req,"accessToken")
    if(!accessToken) {
        throw new AppError(status.UNAUTHORIZED,"Unauthorized")
    }
    const verifiedToken=jwtUtils.verifyToken(accessToken,envVars.ACCESS_TOKEN_SECRET)
    if(!verifiedToken.success){
        throw new AppError(status.UNAUTHORIZED,"Unauthorized")
    }
    // if(verifiedToken.data?.role!==Role.ADMIN) {
    //     throw new AppError(status.UNAUTHORIZED,"Unauthorized")
    // }
      if (authRoles.length > 0 && !authRoles.includes(verifiedToken.data!.role as Role)) {
            throw new AppError(status.FORBIDDEN, 'Forbidden access! You do not have permission to access this resource.');
        }

        next()
    } catch (error) {
        next(error)
    }
 }