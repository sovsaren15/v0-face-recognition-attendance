import { db } from "../config/firebase.js"
import admin from "firebase-admin"

// Mark attendance with face data
export const markAttendance = async (req, res) => {
  try {
    const { employeeId, faceDescriptor, timestamp } = req.body

    if (!employeeId || !faceDescriptor) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const attendanceRef = db.collection("attendance").doc()
    await attendanceRef.set({
      employeeId,
      faceDescriptor,
      timestamp: timestamp || admin.firestore.FieldValue.serverTimestamp(),
      status: "present",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.status(201).json({
      success: true,
      message: "Attendance marked successfully",
      id: attendanceRef.id,
    })
  } catch (error) {
    console.error("Error marking attendance:", error)
    res.status(500).json({ error: "Failed to mark attendance" })
  }
}

// Get attendance records for an employee
export const getAttendanceRecords = async (req, res) => {
  try {
    const { employeeId } = req.params
    const { startDate, endDate } = req.query

    let query = db.collection("attendance").where("employeeId", "==", employeeId)

    if (startDate) {
      query = query.where("timestamp", ">=", new Date(startDate))
    }
    if (endDate) {
      query = query.where("timestamp", "<=", new Date(endDate))
    }

    const snapshot = await query.orderBy("timestamp", "desc").get()
    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json({ success: true, records })
  } catch (error) {
    console.error("Error fetching attendance:", error)
    res.status(500).json({ error: "Failed to fetch attendance records" })
  }
}

// Get today's attendance report
export const getTodayAttendance = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const snapshot = await db
      .collection("attendance")
      .where("timestamp", ">=", today)
      .where("timestamp", "<", tomorrow)
      .orderBy("timestamp", "desc")
      .get()

    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json({ success: true, records })
  } catch (error) {
    console.error("Error fetching today attendance:", error)
    res.status(500).json({ error: "Failed to fetch today attendance" })
  }
}

// Delete attendance record
export const deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params
    await db.collection("attendance").doc(id).delete()
    res.json({ success: true, message: "Attendance record deleted" })
  } catch (error) {
    console.error("Error deleting attendance:", error)
    res.status(500).json({ error: "Failed to delete attendance record" })
  }
}
