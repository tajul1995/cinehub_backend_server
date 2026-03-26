import { Router } from "express";
import { movieController } from "./movie.controller";


const router=Router()
router.post('/',movieController.createMovie)
router.get('/',movieController.getAllMovie)
router.get('/:id',movieController.getMovieById)
router.delete('/:id',movieController.deleteMovieById)
export const movieRoute=router