import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import attendanceRoutes from "./routes/attendance.js"
import employeeRoutes from "./routes/employees.js"

dotenv.config()

const app = express()

// Middleware
app.use(cors())
app.use(express.json({ limit: "50mb" }))
app.use(express.urlencoded({ limit: "50mb", extended: true }))

// Routes
app.use("/api/attendance", attendanceRoutes)
app.use("/api/employees", employeeRoutes)

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Smart Attendance API running on port ${PORT}`)
})
