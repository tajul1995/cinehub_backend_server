import { ReviewStatus } from "../../../generated/prisma/enums";


export interface IReviewPayload {
    movieId  : string,
    bookingId  : string,
    comment: string
    
}

export interface IReviewUpdatePayload {
    
    comment?: string,
    status?:ReviewStatus

}