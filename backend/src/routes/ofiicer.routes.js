import {Router} from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { approveBooking, callNext, completeBooking, getProfile, recordProcurement, rejectBooking, todayBookings, verifyFarmer } from "../controllers/officer.controller.js";

const router = Router();

router.use(verifyJWT, checkRole("officer")); 

router.get("/profile", getProfile);
router.get("/today", todayBookings);
router.patch("/verify/:id", verifyFarmer);
router.post("/procurement/:id", recordProcurement);
router.patch("/approve/:id", approveBooking);
router.patch("/reject/:id", rejectBooking);
router.patch("/call-next", callNext);
router.patch("/complete/:id", completeBooking);

export default router