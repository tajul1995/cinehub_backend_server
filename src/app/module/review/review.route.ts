import { Router } from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router=Router()
router.post('/',checkAuth(Role.USER,Role.ADMIN),reviewController.createReview)
router.get('/',checkAuth(Role.USER,Role.ADMIN),reviewController.getReview)
router.patch('/:id',checkAuth(Role.USER,Role.ADMIN),reviewController.updateReview)
router.delete('/:id',checkAuth(Role.USER,Role.ADMIN),reviewController.deleteReview)

export const reviewRoute=router