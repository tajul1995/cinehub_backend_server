import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { bookingController } from "./booking.controller";
import { Role } from '../../../generated/prisma/enums';

const router=Router()
router.post('/',checkAuth(Role.USER,Role.ADMIN),bookingController.createBooking)
router.get('/',checkAuth(Role.USER,Role.ADMIN),bookingController.getSingleBooking)
router.patch('/',checkAuth(Role.USER,Role.ADMIN),bookingController.updateBooking)
router.post("/initiate-payment/:id", checkAuth(Role.USER), bookingController.initiatePayment);
export const bookingRoute=router