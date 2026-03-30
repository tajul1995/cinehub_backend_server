import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router=Router()
router.get('/',checkAuth(Role.ADMIN),  PaymentController.totalPayment)
export const paymentRoute=router
