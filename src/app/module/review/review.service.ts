import { Role } from '../../../generated/prisma/enums';
import { IRequestUser } from '../../interfaces/user.interface';
import { prisma } from '../../lib/prisma';

import { IReviewPayload, IReviewUpdatePayload } from './review.interface';


const createReview=async(Payload:IReviewPayload,user:IRequestUser)=>{
    return await prisma.review.create({data:{...Payload,userId:user.userId}})
}
const getReview=async(user:IRequestUser)=>{
    if(user.role===Role.ADMIN){
        return await prisma.review.findMany({include:{movie:true,booking:true,user:true}})
    }
    return await prisma.review.findMany({where:{userId:user.userId},
    include:{
        movie:true,
        booking:true,
    }})
    
    
    
    
}
const updateReview=async(Payload:IReviewUpdatePayload,user:IRequestUser,reviewId:string)=>{
    
     if(user.role===Role.ADMIN){
         return await prisma.review.update({where:{id:reviewId},data:Payload})
     }
    return await prisma.review.update({where:{id:reviewId,userId:user.userId},data:{userId:user.userId,...Payload}})
    
}
const deleteReview=async(reviewId:string)=>{
    // if(user.role===Role.ADMIN){
    //     return await prisma.review.delete({where:{id:reviewId}})
    // }
    return await prisma.review.delete({where:{id:reviewId}})
    
}
export const reviewService={
    createReview,
    getReview,
    updateReview,
    deleteReview
}