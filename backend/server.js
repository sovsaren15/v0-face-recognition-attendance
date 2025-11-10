import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import attendanceRoutes from "./routes/attendance.js"
import employeeRoutes from "./routes/employees.js"
import uploadRoutes from "./routes/uploads.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Routes
app.use("/api/attendance", attendanceRoutes)
app.use("/api/employees", employeeRoutes)
app.use("/api/uploads", uploadRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

// Export the app for Vercel
export default app
