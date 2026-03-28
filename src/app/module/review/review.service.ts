import { Role } from '../../../generated/prisma/enums';
import { IRequestUser } from '../../interfaces/user.interface';
import { prisma } from '../../lib/prisma';

import { IReviewPayload, IReviewUpdatePayload } from './review.interface';


const createReview=async(Payload:IReviewPayload,user:IRequestUser)=>{
    return await prisma.review.create({data:{movieId:Payload.movieId,bookingId:Payload.bookingId,userId:user.userId}})
}
const getReview=async(user:IRequestUser)=>{
    if(user.role===Role.ADMIN){
        return await prisma.review.findMany()
    }
    return await prisma.review.findMany({where:{userId:user.userId}})
    
}
const updateReview=async(Payload:IReviewUpdatePayload,user:IRequestUser)=>{
    return await prisma.review.update({where:{userId:user.userId},data:Payload})
    
}
export const reviewService={
    createReview,
    getReview,
    updateReview
}