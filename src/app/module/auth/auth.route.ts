import { Router } from "express";
import { AuthController } from "./auth.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";

const router=Router()
router.post("/register",AuthController.registerUser)
 router.post("/login",AuthController.loginUser)
 router.get("/me",checkAuth(Role.USER,Role.ADMIN)  , AuthController.getMe)
 router.post("/token-refresh", AuthController.getNewToken)
 router.post("/change-password",checkAuth(Role.USER,Role.ADMIN),AuthController.changePassword)
 router.post("/logout",checkAuth(Role.USER,Role.ADMIN),AuthController.logoutUser)
export const authRoute=router