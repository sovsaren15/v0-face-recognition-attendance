import { db } from "../config/firebase.js"
import admin from "firebase-admin"

// Register new employee with face data
export const registerEmployee = async (req, res) => {
  try {
    const { name, email, department, faceDescriptor } = req.body

    if (!name || !email || !faceDescriptor) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    // Check if employee exists
    const existingEmployee = await db.collection("employees").where("email", "==", email).get()

    if (!existingEmployee.empty) {
      return res.status(400).json({ error: "Employee already exists" })
    }

    const employeeRef = db.collection("employees").doc()
    await employeeRef.set({
      name,
      email,
      department: department || "General",
      faceDescriptor,
      status: "active",
      registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    })

    res.status(201).json({
      success: true,
      message: "Employee registered successfully",
      employeeId: employeeRef.id,
    })
  } catch (error) {
    console.error("Error registering employee:", error)
    res.status(500).json({ error: "Failed to register employee" })
  }
}

// Get all employees
export const getAllEmployees = async (req, res) => {
  try {
    const snapshot = await db.collection("employees").where("status", "==", "active").get()
    const employees = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))

    res.json({ success: true, employees })
  } catch (error) {
    console.error("Error fetching employees:", error)
    res.status(500).json({ error: "Failed to fetch employees" })
  }
}

// Get single employee
export const getEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const doc = await db.collection("employees").doc(id).get()

    if (!doc.exists) {
      return res.status(404).json({ error: "Employee not found" })
    }

    res.json({ success: true, employee: { id: doc.id, ...doc.data() } })
  } catch (error) {
    console.error("Error fetching employee:", error)
    res.status(500).json({ error: "Failed to fetch employee" })
  }
}

// Update employee
export const updateEmployee = async (req, res) => {
  try {
    const { id } = req.params
    const { name, department, faceDescriptor } = req.body

    const updateData = {
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }

    if (name) updateData.name = name
    if (department) updateData.department = department
    if (faceDescriptor) updateData.faceDescriptor = faceDescriptor

    await db.collection("employees").doc(id).update(updateData)

    res.json({ success: true, message: "Employee updated successfully" })
  } catch (error) {
    console.error("Error updating employee:", error)
    res.status(500).json({ error: "Failed to update employee" })
  }
}

// Delete employee (soft delete)
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params
    await db
      .collection("employees")
      .doc(id)
      .update({ status: "inactive", updatedAt: admin.firestore.FieldValue.serverTimestamp() })

    res.json({ success: true, message: "Employee deleted successfully" })
  } catch (error) {
    console.error("Error deleting employee:", error)
    res.status(500).json({ error: "Failed to delete employee" })
  }
}
