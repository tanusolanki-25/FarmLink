import {Router} from "express"
import { changePassword, forgotPassword, login, logout, refreshAccessToken, register, resendOTP, resetPassword, verifyEmail } from "../controllers/auth.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"

const router = Router()

router.route("/register").post(register)
router.route("/verify-email").post(verifyEmail)
router.route("/resend-otp").post(resendOTP)

router.route("/login").post(login)
router.route("/change-password").patch(verifyJWT, changePassword)
router.route("/forgot-password").post(forgotPassword)
router.route("/reset-password/:token").post(resetPassword)
router.route("/refresh").post(refreshAccessToken)

router.route("/logout").get(verifyJWT, logout)

export default router