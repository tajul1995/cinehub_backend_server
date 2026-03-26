import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router()
router.post("/register",AuthController.registerUser)
 router.post("/login",AuthController.loginUser)
 router.get("/me",checkAuth(Role.USER,Role.ADMIN)  , AuthController.getMe)
 router.post("/token-refresh", AuthController.getNewToken)
export const authRoute=router