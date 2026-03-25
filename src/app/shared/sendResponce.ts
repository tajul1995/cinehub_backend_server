import { Response } from "express"

interface IResponceData<T>{
    httpStatuscode:number,
    success:boolean,
    message:string,
    data?:T,
    meta?:{
        page:number,
        limit:number,
        total:number,
        totalPages:number
    }
}


export const sendResponce=<T>(res:Response,responceData:IResponceData<T>)=>{
    const {httpStatuscode,success,message,data,meta}=responceData
    res.status(httpStatuscode).json({
        success,
        message,
        data,
        meta
    })
    
}