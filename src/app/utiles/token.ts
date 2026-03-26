import { JwtPayload, SignOptions } from "jsonwebtoken"
import { envVars } from "../../config/env"
import { jwtUtils } from "./jwt"
import { cookieUtils } from "./cookies"
import { Response } from "express"

const getAccessToken=(payload:JwtPayload)=>{
    const accessToken=jwtUtils.createToken(payload,
        envVars.ACCESS_TOKEN_SECRET,
        {expiresIn:envVars.ACCESS_TOKEN_EXPIRES_IN} as SignOptions
    )
    return accessToken
}

const getRefreshToken=(payload:JwtPayload)=>{
    const refreshToken=jwtUtils.createToken(payload,
        envVars.REFRESH_TOKEN_SECRET,
        {expiresIn:envVars.REFRESH_TOKEN_EXPIRES_IN} as SignOptions
    )
    return refreshToken
}
const setAccessTokenCookie=(res:Response,token:string)=>{
    cookieUtils.setCookie(res,"accessToken",token,{httpOnly:true,
        secure:true,
        sameSite:"none",
         maxAge: 60 * 60 * 24*1000 ,


    })
    
}

const setRefreshTokenCookie=(res:Response,token:string)=>{
    cookieUtils.setCookie(res,"refreshToken",token,{httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 60 * 60 * 24 *  7*1000,
    })
}
const setBetterAuthSessionCookies=(res:Response,token:string)=>{
    cookieUtils.setCookie(res,"better-auth.session_token",token,{httpOnly:true,
        secure:true,
        sameSite:"none",
        maxAge: 60 * 60 * 24*1000 ,
    })
    
}
export const tokenUtils={
    getAccessToken:getAccessToken,
    getRefreshToken:getRefreshToken,
    setAccessTokenCookie:setAccessTokenCookie,
    setRefreshTokenCookie:setRefreshTokenCookie,
    setBetterAuthSessionCookies:setBetterAuthSessionCookies
}