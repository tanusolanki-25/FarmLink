import redis from "../config/redis.js";
import prisma from "../services/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import calculateDistance from "../utils/distance.js";

const registerFarmer = asyncHandler(async (req, res) => {
  const { name, fatherName, address, village, district, state, adhaarNumber } =
    req.body;

  if (
    [name, address, village, district, state].some(
      (field) => !field || typeof field !== "string" || !field.trim()
    )
  ) {
    throw new ApiError(400, "Required fields are mandatory");
  }

  const existing = await prisma.farmer.findUnique({
    where: { userId: req.user.id },
  });

  // If Farmer already exists
  if (existing) {
    throw new ApiError(409, "Farmer already exists. Please sign in.");
  }

  // Create brand new Farmer
  await prisma.farmer.create({
    data: {
      userId: req.user.id,
      name,
      fatherName,
      address,
      village,
      district,
      state,
      adhaarNumber,
    },
  });

  const createdFarmer = await prisma.farmer.findUnique({
    where: { userId: req.user.id },
    select: {
      name: true,
      address: true,
      district: true,
      state: true,
    },
  });

  if (!createdFarmer) {
    throw new ApiError(
      500,
      "Something went wrong while registering the farmer"
    );
  }

  return res
    .status(201)
    .json(
      new ApiResponse(201, createdFarmer, "farmer registered successfully")
    );
});

const getProfile = asyncHandler(async (req, res) => {
  const farmer = await prisma.farmer.findUnique({
    where: { userId: req.user.id },
    include: {
      user: {
        select: { email: true, phone: true },
      },
    },
  });

  if (!farmer) {
    throw new ApiError(404, "Profile not found");
  }

  const isComplete = !!(
    farmer.address &&
    farmer.village &&
    farmer.district &&
    farmer.state
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        farmer: farmer,
        isProfileComplete: isComplete,
      },
      "Profile fetched successfully"
    )
  );
});

const updateProfile = asyncHandler(async (req, res) => {
  const { address, village, district, state, name, phone } = req.body;

  const farmer = await prisma.farmer.update({
    where: { userId: req.user.id },
    data: { address, village, district, state },
  });

  if (name || phone) {
    await prisma.farmer.update({
      where: { userId: req.user.id },
      data: { ...(name && { name }), ...(phone && { phone }) },
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, farmer, "Profile updated successfully"));
});

const getCenters = asyncHandler(async (req, res) => {
  const centers = await prisma.center.findMany({
    orderBy: { centerName: "asc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, centers, "Center Fetched Successfully"));
});

const getNearbyCenters = asyncHandler(async (req, res) => {
  const { lat, long } = req.query;

  if (!lat || !long) {
    throw new ApiError(400, "Latitude and longitude required");
  }

  const centers = await prisma.center.findMany();

  const centersWithDistance = centers.map((center) => ({
    ...center,
    distance: calculateDistance(
      parseFloat(lat),
      parseFloat(long),
      center.latitude,
      center.longitude
    ),
  }));

  centersWithDistance.sort((a, b) => a.distance - b.distance);

  return res
    .status(200)
    .json(
      new ApiResponse(200, centersWithDistance, "Distance find successfully")
    );
});

const bookSlot = asyncHandler(async (req, res) => {
  const { centerId, date, time, crop, estimatedQuantity } = req.body;
  const bookingDate = new Date(date + "T00:00:00.000Z");

  const qty = Number(estimatedQuantity);
  if (!crop || !String(crop).trim()) {
    throw new ApiError(400, "Please select the crop you are bringing");
  }
  if (!Number.isFinite(qty) || qty <= 0) {
    throw new ApiError(400, "Enter the approximate quantity in quintals");
  }

  const farmer = await prisma.farmer.findUnique({
    where: { userId: req.user.id },
  });

  if (!farmer) {
    throw new ApiError(404, "Farmer profile not found");
  }

  if (!farmer.address || !farmer.village) {
    throw new ApiError(400, "Please complete your profile before booking slot");
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (bookingDate < today) {
    throw new ApiError(400, "Cannot book on past date");
  }

  const lockKey = `lock:book:${farmer.id}:${date}`;
  const locked = await redis.set(lockKey, "1", "EX", 10, "NX");
  if (!locked) {
    throw new ApiError(429, "Wait for a while, booking is processed");
  }

  const existing = await prisma.booking.findFirst({
    where: {
      farmerId: farmer.id,
      date: bookingDate,
      status: { notIn: ["cancelled", "rejected"] },
    },
  });
  if (existing) {
    throw new ApiError(
      400,
      `Your Booking is exist in this date (Token ${existing.token})`
    );
  }

  const center = await prisma.center.findUnique({
    where: { id: Number(centerId) },
  });
  if (!center) {
    throw new ApiError(404, "Center is not found");
  }

  const bookedCount = await prisma.booking.count({
    where: {
      centerId: center.id,
      date: bookingDate,
      status: { not: "cancelled" },
    },
  });

  if (bookedCount >= center.totalSlots) {
    return res.status(400).json({ message: "All Slot is full at that day" });
  }

  const tokenKey = `token-counter:${centerId}:${date}`;
  const newToken = await redis.incr(tokenKey);
  await redis.expire(tokenKey, 60 * 60 * 24);

  const booking = await prisma.booking.create({
    data: {
      farmerId: farmer.id,
      centerId,
      date: new Date(date),
      time,
      token: newToken,
      crop: String(crop).trim(),
      estimatedQuantity: qty,
    },
  });

  await prisma.queue.create({
    data: { bookingId: booking.id, currentPosition: newToken },
  });

  return res
    .status(201)
    .json(new ApiResponse(201, booking, "Slot booked successfully"));
});

const myBookings = asyncHandler(async (req, res) => {
  const farmer = await prisma.farmer.findUnique({
    where: { userId: req.user.id },
  });

  if (!farmer) {
    return res.status(200).json(new ApiResponse(200, [], "No farmer profile"));
  }

  const bookings = await prisma.booking.findMany({
    where: { farmerId: farmer.id },
    include: {
      center: true,
      queue: true,
      payment: true,
      procurement: true,
    },
    orderBy: { date: "desc" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, bookings, "Bookings retrieved successfully"));
});

const getBookingDetail = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      center: true,
      queue: true,
      payment: true,
      procurement: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking details fetched"));
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.update({
    where: { id: Number(id) },
    data: { status: "rejected" },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Booking cancelled successfully"));
});

const deleteBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  await prisma.booking.delete({
    where: { id: Number(id) },
  });

  return res
    .status(200)
    .json(new ApiResponse(200, "", "Booking deleted successfully"));
});

const getQueueStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      center: true,
    },
  });

  if (!booking) {
    throw new ApiError(404, "Booking not found");
  }

  let currentServing = await redis.get(`queue:${booking.centerId}:current`);

  currentServing = currentServing ? parseInt(currentServing) : 0;

  const peopleAhead = booking.token - currentServing;

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        myToken: booking.token,
        currentServing,
        peopleAhead: peopleAhead > 0 ? peopleAhead : 0,
        estimatedWaitMinutes: peopleAhead > 0 ? peopleAhead * 5 : 0,
      },
      "Queue status fetched successfully"
    )
  );
});

export {
  registerFarmer,
  getProfile,
  updateProfile,
  getCenters,
  getNearbyCenters,
  bookSlot,
  myBookings,
  getBookingDetail,
  cancelBooking,
  getQueueStatus,
  deleteBooking,
};
