import { Router } from "express";
import { movieRoute } from "../module/movie/movie.route";
import { authRoute } from "../module/auth/auth.route";
import { bookingRoute } from "../module/booking/booking.route";
import { reviewRoute } from "../module/review/review.route";

const router=Router()

router.use("/createMovie",movieRoute)
router.use("/auth",authRoute)
router.use("/booking",bookingRoute)
router.use("/review",reviewRoute)
export const indexRoute=router