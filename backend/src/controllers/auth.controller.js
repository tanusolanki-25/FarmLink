import { ApiError } from "../utils/apiError.js";
import prisma from "../services/prisma.js";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateOTP, getOtpHtml } from "../services/generateOtp.js";
import { client, sendEmail } from "../services/email.service.js";
import { ApiResponse } from "../utils/apiResponse.js";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    if (!userId) {
      throw new ApiError(400, "User ID is required");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    await prisma.user.update({
      where: { id: userId },
      data: { refreshToken },
    });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      400,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const register = asyncHandler(async (req, res) => {
  const { email, password, phone } = req.body;

  if (
    [email, password].some(
      (field) => !field || typeof field !== "string" || !field.trim()
    )
  ) {
    throw new ApiError(400, "Email and password are required");
  }

  const cleanedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({
    where: { email: cleanedEmail },
  });

  const otp = await generateOTP();
  const html = await getOtpHtml(otp);
  const otpHash = await hashPassword(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  // If user already exists
  if (existing) {
    if (existing.verified) {
      throw new ApiError(
        409,
        "User with this email already exists. Please sign in."
      );
    }

    // User is registered but not yet verified -> update credentials & send new OTP
    const passwordHash = await hashPassword(password);
    const updatedUser = await prisma.user.update({
      where: { id: existing.id },
      data: {
        passwordHash,
        phone: phone || existing.phone,
      },
      select: {
        id: true,
        email: true,
        role: true,
        verified: true,
      },
    });

    await prisma.otp.upsert({
      where: { email: cleanedEmail },
      update: { otpHash, expiresAt, userId: updatedUser.id },
      create: {
        email: cleanedEmail,
        userId: updatedUser.id,
        otpHash,
        expiresAt,
      },
    });

    try {
      await sendEmail(
        cleanedEmail,
        "OTP Verification",
        `Your OTP code is ${otp}`,
        html
      );
    } catch (error) {
      console.error("Email send error:", error);
    }

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          updatedUser,
          "Verification OTP has been resent to your email"
        )
      );
  }

  // Create brand new user
  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      email: cleanedEmail,
      passwordHash,
      phone,
    },
  });

  await prisma.otp.upsert({
    where: { email: cleanedEmail },
    update: { otpHash, expiresAt, userId: user.id },
    create: {
      email: cleanedEmail,
      userId: user.id,
      otpHash,
      expiresAt,
    },
  });

  try {
    await sendEmail(
      cleanedEmail,
      "OTP Verification",
      `Your OTP code is ${otp}`,
      html
    );
  } catch (error) {
    console.error("Email send error:", error);
  }

  const createdUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      id: true,
      email: true,
      role: true,
      verified: true,
    },
  });

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, createdUser, "User registered successfully"));
});

const verifyEmail = asyncHandler(async (req, res) => {
  const { otp, email } = req.body;

  const otpDoc = await prisma.otp.findUnique({
    where: {
      email,
    },
  });

  if (!otpDoc) {
    throw new ApiError(400, "Otp not found");
  }

  if (otpDoc.expiresAt < new Date()) {
    await prisma.otp.delete({
      where: {
        email,
      },
    });

    throw new ApiError(400, "Otp has expired");
  }

  const isValid = await verifyPassword(otp, otpDoc.otpHash);

  if (!isValid) {
    throw new ApiError(400, "Invalid OTP");
  }

  if (otpDoc.expiresAt > new Date()) {
    await prisma.user.update({
      where: {
        id: otpDoc.userId,
      },
      data: {
        verified: true,
      },
    });
  }

  await prisma.otp.delete({
    where: {
      userId: otpDoc.userId,
    },
  });

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    otpDoc.userId
  );

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  const loggedInUser = await prisma.user.findUnique({
    where: { id: otpDoc.userId },
    select: {
      email: true,
      role: true,
    },
  });

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, options)
    .cookie("accessToken", accessToken, options)
    .json(
      new ApiResponse(
        200,
        { user: loggedInUser, refreshToken, accessToken },
        "User logged in successfully"
      )
    );
});

const resendOTP = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.verified) {
    throw new ApiError(400, "Email already verified");
  }

  const otp = generateOTP();
  console.log(otp);
  const otpHash = await hashPassword(otp);
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.otp.upsert({
    where: { email },
    update: {
      otpHash,
      expiresAt,
    },
    create: {
      email,
      otpHash,
      userId: user.id,
      expiresAt,
    },
  });

  const html = await getOtpHtml(otp);

  await sendEmail(email, "New OTP Verification", `Your OTP is ${otp}`, html);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "OTP sent successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate Email
  if (!email || typeof email !== "string" || !email.trim()) {
    throw new ApiError(400, "Email is required");
  }

  // Validate Password
  if (!password || typeof password !== "string") {
    throw new ApiError(400, "Password is required");
  }

  const cleanedEmail = email.trim().toLowerCase();

  // Find User
  const user = await prisma.user.findUnique({
    where: {
      email: cleanedEmail,
    },
  });

  if (!user) {
    throw new ApiError(404, "Don't have an account with this email");
  }

  // Check Password Exists
  if (!user.passwordHash) {
    throw new ApiError(400, "Password not found. Please register again.");
  }

  // Verify Password First
  const isValidPassword = await verifyPassword(password, user.passwordHash);

  if (!isValidPassword) {
    throw new ApiError(401, "Password is not valid");
  }

  // Email Not Verified
  if (!user.verified) {
    const otp = await generateOTP();
    const otpHash = await hashPassword(otp);
    const html = await getOtpHtml(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await prisma.otp.upsert({
      where: {
        email: cleanedEmail,
      },
      update: {
        otpHash,
        expiresAt,
        userId: user.id,
      },
      create: {
        email: cleanedEmail,
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    try {
      await sendEmail(
        cleanedEmail,
        "OTP Verification",
        `Your OTP code is ${otp}`,
        html
      );
    } catch (error) {
      console.error("Email send error:", error);
      throw new ApiError(500, "Unable to send OTP email");
    }

    return res.status(200).json(
      new ApiResponse(
        200,
        {
          email: user.email,
          role: user.role,
          verified: user.verified,
        },
        "Your email is not verified. A new OTP has been sent to your email."
      )
    );
  }

  // Update Login Status (Optional)
  await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      isEmailValid: true,
    },
  });

  // Generate Tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user.id
  );

  // Logged In User
  const loggedInUser = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      id: true,
      email: true,
      role: true,
      verified: true,
    },
  });

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };

  return res
    .status(200)
    .cookie("refreshToken", refreshToken, cookieOptions)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logout = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await prisma.user.update({
    where: { id: userId },
    data: { refreshToken: null },
  });

  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  };

  return res
    .status(200)
    .clearCookie("refreshToken", options)
    .clearCookie("accessToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const userId = decodedToken?.id || decodedToken?.userId;
    if (!userId) {
      throw new ApiError(401, "Invalid refresh token payload");
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
      throw new ApiError(401, "Refresh token is expired or already used");
    }

    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV || "production",
      sameSite: process.env.NODE_ENV || "production" ? "none" : "lax",
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshToken(user.id);

    return res
      .status(200)
      .cookie("refreshToken", newRefreshToken, options)
      .cookie("accessToken", accessToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid refresh token");
  }
});

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  if (!email) throw new ApiError(400, "Email is required");

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    throw new ApiError(400, "Email is not registered");
  }

  const rawToken = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(rawToken)
    .digest("hex");

  const expiry = new Date();
  expiry.setMinutes(expiry.getMinutes() + 15); // valid for 15 minutes

  await prisma.user.update({
    where: { email },
    data: { resetPasswordToken: hashedToken, resetPasswordExpiry: expiry },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;
  await client.transactionalEmails.sendTransacEmail({
    sender: {
      name: "FarmLink",
      email: process.env.BREVO_SENDER_EMAIL,
    },
    to: [{ email: email }],
    subject: "Reset your FarmLink password",
    htmlContent: `<p>Click the link below to reset your password. This link expires in 15 minutes.</p>
           <a href="${resetLink}">${resetLink}</a>`,
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "If that email is registered, a reset link has been sent"
      )
    );
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  if (!newPassword) throw new ApiError(400, "New password is required");

  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      resetPasswordToken: hashedToken,
      resetPasswordExpiry: { gte: new Date() },
    },
  });

  if (!user) {
    throw new ApiError(400, "Reset link is invalid or has expired");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordHash: newPasswordHash,
      resetPasswordToken: null,
      resetPasswordExpiry: null,
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Old password and new password are required");
  }

  const user = await prisma.user.findUnique({ where: { id: req.user.id } });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordCorrect = await verifyPassword(
    oldPassword,
    user.passwordHash
  );

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  const newPasswordHash = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: newPasswordHash },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});

export {
  register,
  verifyEmail,
  resendOTP,
  login,
  logout,
  refreshAccessToken,
  forgotPassword,
  resetPassword,
  changePassword,
};
