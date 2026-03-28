import { checkAuth } from './../../middlewares/checkAuth';
import { Router } from "express";
import { bookingController } from "./booking.controller";
import { Role } from '../../../generated/prisma/enums';

const router=Router()
router.post('/',checkAuth(Role.USER,Role.ADMIN),bookingController.createBooking)
export const bookingRoute=router