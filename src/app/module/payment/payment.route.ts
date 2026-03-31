import { Router } from "express";
import { PaymentController } from "./payment.controller";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../../../generated/prisma/enums";


const router=Router()
router.get('/',checkAuth(Role.ADMIN),  PaymentController.totalPayment)
router.patch('/:id', checkAuth(Role.ADMIN,Role.USER), PaymentController.updatePaymentStatus)
export const paymentRoute=router
