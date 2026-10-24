import { Router } from "express";
import { addOfficer, createCenter, deleteCenter, getCenters, getOfficers, getProfile, getReports, getStats, getUsers, updateCenter, updateOfficerCenter } from "../controllers/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { checkRole } from "../middlewares/checkRole.js";
const router = Router();

router.use(verifyJWT, checkRole("admin"));

// Dashboard
router.get("/profile", getProfile);
router.get("/stats", getStats);
router.get("/reports", getReports);

// Users
router.get("/users", getUsers);

// Centers
router.get("/centers", getCenters);
router.post("/centers", createCenter);
router.put("/centers/:id", updateCenter);
router.delete("/centers/:id", deleteCenter);

// Officers
router.get("/officers", getOfficers);
router.post("/add-officer", addOfficer);
router.patch("/officers/:id/center", updateOfficerCenter);

export default router;