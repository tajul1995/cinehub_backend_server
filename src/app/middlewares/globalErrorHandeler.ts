import { NextFunction, Request, Response } from "express"
import { envVars } from "../../config/env"
import { TErrorResponse, TErrorSources } from "../interfaces/error.interfce"
import status from "http-status"
import AppError from "../errorHelpers/AppError"
import { handleZodError } from "../errorHelpers/zodErrorhandler"
import z from "zod";
import { Prisma } from "../../generated/prisma/client"
import { handlePrismaClientKnownRequestError, handlePrismaClientUnknownError, handlePrismaClientValidationError, handlerPrismaClientInitializationError, handlerPrismaClientRustPanicError } from "../errorHelpers/prismaErrorHandler"

export const globalErrorHandlers=async(err:any,req:Request,res:Response,next:NextFunction)=>{
    if(envVars.NODE_ENV==="development"){
        console.log("ERROR FROM GLO9BAL ERROR HANDLER:",err)
    }
    // if(req.file){
    //     await deleteFileFromCloudinary(req.file.path)
    // }
    // if(req.files && Array.isArray(req.files)&& req.files.length>0){
    //     const imageURLs=req.files.map((file:any)=>file.path)
    //     await Promise.all(imageURLs.map((url:string)=>deleteFileFromCloudinary(url)))
    // }

    // await deleteUploadedFilesFromGlobalErrorHandler(req)
    let errorSources:TErrorSources[]=[]
    let statusCode:number=status.INTERNAL_SERVER_ERROR
    let message:string="INTERNAL SERVER ERROR"
    let stack:string|undefined=undefined
    if(err instanceof Prisma.PrismaClientKnownRequestError){
        const simplifiedError = handlePrismaClientKnownRequestError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;
    } else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        const simplifiedError = handlePrismaClientUnknownError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;
    } else if(err instanceof Prisma.PrismaClientValidationError){
        const simplifiedError = handlePrismaClientValidationError(err)
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;
    } else if (err instanceof Prisma.PrismaClientRustPanicError) {
        const simplifiedError = handlerPrismaClientRustPanicError();
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;
    } else if(err instanceof Prisma.PrismaClientInitializationError){
        const simplifiedError = handlerPrismaClientInitializationError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        errorSources = [...simplifiedError.errorSources]
        stack = err.stack;
    }
     else  if(err instanceof z.ZodError){
        const simplifiedError = handleZodError(err);
        statusCode = simplifiedError.statusCode as number
        message = simplifiedError.message
        stack=err.stack
        errorSources = [...simplifiedError.errorSources]
    }
    else if(err instanceof AppError){
        message=err.message
        statusCode=err.statusCode
        stack=err.stack
        errorSources=[{
            path:'',
            message:err.message
        }]

    }

        else if(err instanceof Error){
        message=err.message
        statusCode=status.INTERNAL_SERVER_ERROR
        stack=err.stack
        errorSources=[{
            path:'',
            message:err.message
        }]
    }



    const errorResponse: TErrorResponse = {
        success: false,
        message: message,
        errorSources,
        error: envVars.NODE_ENV === 'development' ? err : undefined,
        stack: envVars.NODE_ENV === 'development' ? stack : undefined
   
    }

    res.status(statusCode).json(errorResponse)
}