import { Router } from "express";
import { movieRoute } from "../module/movie/movie.route";

const router=Router()

router.use("/createMovie",movieRoute)
export const indexRoute=router