import { Router } from "express";
import { movieRoute } from "../module/movie/movie.route";
import { authRoute } from "../module/auth/auth.route";
import { bookingRoute } from "../module/booking/booking.route";

const router=Router()

router.use("/createMovie",movieRoute)
router.use("/auth",authRoute)
router.use("/booking",bookingRoute)
export const indexRoute=router