import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.js";
import { bookSlot, cancelBooking, deleteBooking, getBookingDetail, getCenters, getNearbyCenters, getProfile, getQueueStatus, myBookings, registerFarmer, updateProfile } from "../controllers/farmer.controller.js";

const router = Router()
router.use(verifyJWT)

router.post("/register", registerFarmer)
router.get("/profile", checkRole("farmer"), getProfile);
router.put("/profile", checkRole("farmer"), updateProfile);

router.get("/centers", checkRole("farmer"), getCenters);
router.get("/nearby-centers", checkRole("farmer"), getNearbyCenters);

router.post("/book-slot",  checkRole("farmer"), bookSlot);
router.get("/my-bookings",  checkRole("farmer"), myBookings);
router.get("/booking/:id",  checkRole("farmer"), getBookingDetail);
router.patch("/booking/:id/cancel",  checkRole("farmer"), cancelBooking);
router.delete("/booking/:id/delete",  checkRole("farmer"), deleteBooking);
router.get("/booking/:id/queue",  checkRole("farmer"), getQueueStatus);

export default router