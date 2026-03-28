import { AppointmentStatus, PaymentStatus } from "../../../generated/prisma/enums";

export interface IBookAppointmentPayload {
    movieId  : string,
    
}

export interface IUpdateBookingPayload {
    
    paymentStatus? :PaymentStatus ,
    status? : AppointmentStatus,
}