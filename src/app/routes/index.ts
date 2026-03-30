import { Router } from "express";
import { movieRoute } from "../module/movie/movie.route";
import { authRoute } from "../module/auth/auth.route";
import { bookingRoute } from "../module/booking/booking.route";
import { reviewRoute } from "../module/review/review.route";
import { paymentRoute } from "../module/payment/payment.route";

const router=Router()

router.use("/createMovie",movieRoute)
router.use("/auth",authRoute)
router.use("/booking",bookingRoute)
router.use("/review",reviewRoute)
router.use("/payment",paymentRoute)
export const indexRoute=router