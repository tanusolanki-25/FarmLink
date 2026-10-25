import redis from "../config/redis.js";
import prisma from "../services/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

async function getOfficer(userId) {
  return prisma.officer.findUnique({ where: { userId } });
}

async function getOwnBooking(bookingId, officer) {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
  });
  if (!booking || booking.centerId !== officer.centerId) {
    throw new ApiError(404, "Booking is not found");
  }
  return booking;
}

const getProfile = asyncHandler(async (req, res) => {
  const officer = await prisma.officer.findUnique({
    where: { userId: req.user.id },
    include: { center: true, user: { select: { email: true, phone: true } } },
  });
  if (!officer) {
    throw new ApiError(404, "Officer is not found");
  }

  return res.status(200).json(new ApiResponse(200, officer, ""));
});

const todayBookings = asyncHandler(async (req, res) => {
  const officer = await getOfficer(req.user.id);
  if (!officer?.centerId) {
    throw new ApiError(400, "No center assigned");
  }

  const nowIST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
  );

  const yyyy = nowIST.getFullYear();
  const mm = String(nowIST.getMonth() + 1).padStart(2, "0");
  const dd = String(nowIST.getDate()).padStart(2, "0");

  const startUTC = new Date(yyyy + "-" + mm + "-" + dd + "T00:00:00.000Z");
  const endUTC = new Date(yyyy + "-" + mm + "-" + dd + "T23:59:59.999Z");

  const bookings = await prisma.booking.findMany({
    where: { centerId: officer.centerId, date: { gte: startUTC, lte: endUTC } },
    include: {
      farmer: { include: { user: { select: { phone: true, email: true } } } },
      procurement: true,
    },
    orderBy: { token: "asc" },
  });

  return res.status(200).json(new ApiResponse(200, bookings, ""));
});

const verifyFarmer = asyncHandler(async (req, res) => {
  const officer = await getOfficer(req.user.id);

  const booking = await getOwnBooking(req.params.id, officer);
  if (!booking) {
    throw new ApiError(404, "Booking is not found for your center");
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "verified" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Farmer is verified"));
});

const recordProcurement = asyncHandler(async (req, res) => {
  const { crop, quantity, quality } = req.body;
  const officer = await getOfficer(req.user.id);
  const booking = await getOwnBooking(req.params.id, officer);

  if (!booking) {
    throw new ApiError(404, "Booking is not found for your center");
  }

  const finalCrop = crop || booking.crop;
  if (!finalCrop) {
    throw new ApiError(400, "Crop is required");
  }

  const procurement = await prisma.procurement.upsert({
    where: { bookingId: booking.id },
    update: { crop: finalCrop, quantity: Number(quantity), quality },
    create: {
      bookingId: booking.id,
      crop: finalCrop,
      quantity: Number(quantity),
      quality,
    },
  });
  return res
    .status(200)
    .json(new ApiResponse(200, procurement, "Procurement details is saved"));
});

const approveBooking = asyncHandler(async (req, res) => {
  const { amount } = req.body;
  const officer = await getOfficer(req.user.id);
  const booking = await getOwnBooking(req.params.id, officer);

  if (!booking) {
    throw new ApiError(404, "Booking is not found for your center");
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "approved" },
  });

  await prisma.procurement.updateMany({
    where: { bookingId: booking.id },
    data: { status: "approved" },
  });

  // Payment record banao (abhi pending)
  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: { amount: Number(amount) },
    create: {
      bookingId: booking.id,
      amount: Number(amount),
      status: "pending",
    },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Booing is updated"));
});

const rejectBooking = asyncHandler(async (req, res) => {
  const officer = await getOfficer(req.user.id);
  const booking = await getOwnBooking(req.params.id, officer);
  if (!booking) {
    throw new ApiError(404, "Booking is not found for your center");
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "rejected" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Booing is rejected"));
});

const callNext = asyncHandler(async (req, res) => {
  const officer = await getOfficer(req.user.id);
  if (!officer?.centerId) {
    throw new ApiError(400, "No center is assigned");
  }
  const key = `queue:${officer.centerId}:current`;
  const currentPosition = await redis.incr(key);
  await redis.expire(key, 60 * 60 * 24);

  const io = req.app.get("io");
  if (io) {
    io.to(`center-${officer.centerId}`).emit("queue-updated", {
      centerId: officer.centerId,
      currentPosition,
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, currentPosition, "Next Token is called"));
});

const completeBooking = asyncHandler(async (req, res) => {
  const officer = await getOfficer(req.user.id);
  const booking = await getOwnBooking(req.params.id, officer);
  if (!booking) {
    throw new ApiError(400, "No center is assigned");
  }

  const updated = await prisma.booking.update({
    where: { id: booking.id },
    data: { status: "completed" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, updated, "Booking is completed"));
});

export {
  getProfile,
  todayBookings,
  verifyFarmer,
  recordProcurement,
  approveBooking,
  rejectBooking,
  callNext,
  completeBooking,
};
