import { Router } from "express";
import { movieRoute } from "../module/movie/movie.route";
import { authRoute } from "../module/auth/auth.route";

const router=Router()

router.use("/createMovie",movieRoute)
router.use("/auth",authRoute)
export const indexRoute=router