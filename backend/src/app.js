import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

const rawOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

const defaultOrigins = [
  "https://health-connect-zeta-seven.vercel.app",
  "http://localhost:5173",
  "http://localhost:3001",
];

const allowedOrigins = Array.from(new Set([...rawOrigins, ...defaultOrigins]));

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    const cleanOrigin = origin.replace(/\/$/, '');
    if (
      allowedOrigins.includes(cleanOrigin) ||
      cleanOrigin.endsWith('.vercel.app') ||
      cleanOrigin.startsWith('http://localhost:') ||
      cleanOrigin.startsWith('http://127.0.0.1:')
    ) {
      return callback(null, true);
    }
    return callback(new Error(`CORS policy blocked request from ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.json({ message: "HealthConnect API is running" })
})

// routes import
import authRouter from "./routes/auth.routes.js"
import farmerRouter from "./routes/farmer.routes.js"
import officerRouter from "./routes/ofiicer.routes.js"
import adminRouter from "./routes/admin.routes.js"

//routes declaration
app.use("/api/auth", authRouter)
app.use("/api/farmer", farmerRouter)
app.use("/api/officer", officerRouter);
app.use("/api/admin",adminRouter)

// global error handling middleware
import { errorHandler } from "../src/middlewares/error.middleware.js"
app.use(errorHandler)

export { app }