import { Router } from "express";
import { reviewController } from "./review.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router=Router()
router.post('/',checkAuth(Role.USER,Role.ADMIN),reviewController.createReview)
router.get('/',checkAuth(Role.USER,Role.ADMIN),reviewController.getReview)
router.patch('/',checkAuth(Role.USER,Role.ADMIN),reviewController.updateReview)

export const reviewRoute=router