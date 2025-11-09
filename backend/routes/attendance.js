import express from "express"
import {
  markAttendance,
  getAttendanceRecords,
  getTodayAttendance,
  deleteAttendance,
} from "../controllers/attendanceController.js"

const router = express.Router()

router.post("/mark", markAttendance)
router.get("/employee/:employeeId", getAttendanceRecords)
router.get("/today", getTodayAttendance)
router.delete("/:id", deleteAttendance)

export default router
