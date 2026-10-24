import prisma from "../lib/prisma.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { hashPassword } from "../utils/bcrypt.js";


function todayRange() {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function toNumber(value) {
  return value === "" || value === null || value === undefined ? NaN : Number(value);
}

function parseCenter(body) {
  const centerName = String(body.centerName || "").trim();
  const location = String(body.location || "").trim();
  const latitude = toNumber(body.latitude);
  const longitude = toNumber(body.longitude);
  const capacity = parseInt(body.capacity, 10);

  if (!centerName || !location) return { error: "Center name and location are required" };
  if (!Number.isFinite(latitude) || latitude < -90 || latitude > 90)
    return { error: "Latitude must be a number between -90 and 90" };
  if (!Number.isFinite(longitude) || longitude < -180 || longitude > 180)
    return { error: "Longitude must be a number between -180 and 180" };
  if (!Number.isInteger(capacity) || capacity < 1)
    return { error: "Capacity must be a whole number, 1 or more" };

  return { data: { centerName, location, latitude, longitude, capacity } };
}

const getProfile = asyncHandler(async(req, res) => {
  const admin = await prisma.user.findUnique({
    where: {
      id: req.user.id
    }
  })

    return res.status(200).json(
      new ApiResponse(200, admin, ""))

})

const getStats = asyncHandler(async(req, res) => {
    const { start, end } = todayRange();

    const [farmers, officers, centers, totalBookings, todayBookings, byStatus, paid] =
      await Promise.all([
        prisma.user.count({ where: { role: "farmer" } }),
        prisma.user.count({ where: { role: "officer" } }),
        prisma.center.count(),
        prisma.booking.count(),
        prisma.booking.count({ where: { date: { gte: start, lt: end } } }),
        prisma.booking.groupBy({ by: ["status"], _count: { _all: true } }),
        prisma.payment.aggregate({ _sum: { amount: true }, where: { status: "completed" } }),
      ]);

    const statusCounts = {};
    byStatus.forEach((row) => {
      statusCounts[row.status] = row._count._all;
    });

    return res.status(200).json(
      new ApiResponse(200, {
      farmers,
      officers,
      centers,
      totalBookings,
      todayBookings,
      paidAmount: paid._sum.amount || 0,
      byStatus: statusCounts,
    }, "Stats are found successfully"))

})

const getReports = asyncHandler(async(req, res) =>{
    const { start, end } = todayRange();

    const centers = await prisma.center.findMany({ orderBy: { centerName: "asc" } });

    const grouped = await prisma.booking.groupBy({
      by: ["centerId", "status"],
      _count: { _all: true },
    });

    const today = await prisma.booking.groupBy({
      by: ["centerId"],
      where: { date: { gte: start, lt: end }, status: { not: "cancelled" } },
      _count: { _all: true },
    });

    const rows = {};
    centers.forEach((c) => {
      rows[c.id] = {
        id: c.id,
        centerName: c.centerName,
        location: c.district + ", " + c.state,
        capacity: c.totalSlots,
        todayBooked: 0,
        total: 0,
        approved: 0,
        rejected: 0,
        completed: 0,
      };
    });

    grouped.forEach((g) => {
      const row = rows[g.centerId];
      if (!row) return;
      const n = g._count._all;
      row.total += n;
      if (g.status === "approved") row.approved += n;
      if (g.status === "rejected") row.rejected += n;
      if (g.status === "completed") row.completed += n;
    });

    today.forEach((t) => {
      if (rows[t.centerId]) rows[t.centerId].todayBooked = t._count._all;
    });

   return res.status(200).json(new ApiResponse(200, Object.values(rows), "Reports fetched successfully"));
})

const getUsers = asyncHandler(async(req, res)=> {
    const { role } = req.query;
    const where = ["farmer", "officer", "admin"].includes(role) ? { role } : {};

    const users = await prisma.user.findMany({
      where,
      select: { id: true, email: true, phone: true, role: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });

    return res.status(200).json(new ApiResponse(200, users, ""));
  
})

const getCenters = asyncHandler(async (req, res) =>{
    const centers = await prisma.center.findMany({ orderBy: { centerName: "asc" } });

    return res.status(200).json(new ApiResponse(200, centers, ""));
})

const createCenter = asyncHandler(async(req, res)=> {
    const { data, error } = parseCenter(req.body);
    if (error) {
      throw new ApiError(400, error)
    }

   const center = await prisma.center.create({ data });
   return res.status(201).json(new ApiResponse(201, center));

})

const updateCenter = asyncHandler(async(req, res)=> {
    const id = Number(req.params.id);
    const { data, error } = parseCenter(req.body);
    if (error) {
      throw new ApiError(400, error)
}
    const existing = await prisma.center.findUnique({ where: { id } });
    if (!existing){
      throw new ApiError(404, "Center is not found")
    }

    const center = await prisma.center.update({ where: { id }, data });
    return res.status(200).json(new ApiResponse(200, center, ""));
  
})

const deleteCenter = asyncHandler(async(req, res)=> {
    const id = Number(req.params.id);

    const existing = await prisma.center.findUnique({ where: { id } });
    if (!existing){
      throw new ApiError(404, "Center is not found")
    }

    const [bookings, officers] = await Promise.all([
      prisma.booking.count({ where: { centerId: id } }),
      prisma.officer.count({ where: { centerId: id } }),
    ]);

    if (bookings > 0) {
      throw new ApiError(400, "This center has bookings, so it can't be deleted")
    }
    if (officers > 0) {
      throw new ApiError(400, "Move the officers of this center to another center first")
    }

    await prisma.center.delete({ where: { id } });

    return res.status(200).json(new ApiResponse(200,"", "Center is deleted"));
})

// ---------- officers ----------
const getOfficers = asyncHandler(async(req, res)=> {
    const officers = await prisma.officer.findMany({
      include: {
        user: { select: { email: true, phone: true, createdAt: true } },
        center: { select: { id: true, centerName: true } },
      },
      orderBy: { id: "desc" },
    });

   return res.status(200).json(new ApiResponse(200, officers, "Officers fetched successfully"));
})

const addOfficer = asyncHandler(async(req, res) =>{
    const name = String(req.body.name || "").trim();
    const email = String(req.body.email || "").trim();
    const phone = String(req.body.phone || "").trim() || null;
    const password = String(req.body.password || "");
    const centerId = Number(req.body.centerId);

    if (!name){
      throw new ApiError(400, "Name is required")
    }

    if (!/^\S+@\S+\.\S+$/.test(email)){
      throw new ApiError(400, "Enter a valid email")
    }
    if (password.length < 6){
      throw new ApiError(400, "Password must be at least 6 characters")
    }

    if (!Number.isInteger(centerId)){
      throw new ApiError(400, "Choose a center for this officer")
    }

    const center = await prisma.center.findUnique({ where: { id: centerId } });
    if (!center){
      throw new ApiError(404, "Center is not found")
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing){
      throw new ApiError(400, "This email is already registered")
    }

    const hashedPassword = await hashPassword(password);

    // User + Officer dono ek saath bante hain, ek fail hua to dono cancel
    const officer = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { email, passwordHash: hashedPassword, role: "officer", phone, verified: true },
      });
      return tx.officer.create({ data: {name, userId: user.id, centerId } });
    });

    return res.status(201).json(
      new ApiResponse(201, officer.id, "Officer added"))
})

const updateOfficerCenter = asyncHandler(async(req, res)=> {
    const id = Number(req.params.id); // Officer table ki id
    const centerId = Number(req.body.centerId);

    if (!Number.isInteger(centerId)){
      throw new ApiError(400, "Choose a center")
    }

    const [officer, center] = await Promise.all([
      prisma.officer.findUnique({ where: { id } }),
      prisma.center.findUnique({ where: { id: centerId } }),
    ]);
    if (!officer) return res.status(404).json({ message: "Officer not found" });
    if (!center) return res.status(404).json({ message: "Center not found" });

    const updated = await prisma.officer.update({ where: { id }, data: { centerId } });
    
    return res.status(200).json(
      new ApiResponse(200,updated, "Officer's center updated")
);
  
})

export {
  getStats,
  getReports,
  getUsers,
  getCenters,
  createCenter,
  updateCenter,
  deleteCenter,
  getOfficers,
  addOfficer,
  updateOfficerCenter,
  getProfile
};
