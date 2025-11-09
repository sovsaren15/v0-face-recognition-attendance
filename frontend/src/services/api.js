const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api"

// Attendance API calls
export const attendanceAPI = {
  markAttendance: async (employeeId, faceDescriptor, timestamp) => {
    const response = await fetch(`${API_BASE_URL}/attendance/mark`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId,
        faceDescriptor: Array.from(faceDescriptor),
        timestamp,
      }),
    })
    if (!response.ok) throw new Error("Failed to mark attendance")
    return response.json()
  },

  getRecords: async (employeeId, startDate, endDate) => {
    const params = new URLSearchParams()
    if (startDate) params.append("startDate", startDate)
    if (endDate) params.append("endDate", endDate)

    const response = await fetch(`${API_BASE_URL}/attendance/employee/${employeeId}?${params}`, { method: "GET" })
    if (!response.ok) throw new Error("Failed to fetch records")
    return response.json()
  },

  getTodayAttendance: async () => {
    const response = await fetch(`${API_BASE_URL}/attendance/today`, {
      method: "GET",
    })
    if (!response.ok) throw new Error("Failed to fetch today attendance")
    return response.json()
  },

  deleteRecord: async (id) => {
    const response = await fetch(`${API_BASE_URL}/attendance/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete record")
    return response.json()
  },
}

// Employee API calls
export const employeeAPI = {
  register: async (name, email, department, faceDescriptor) => {
    const response = await fetch(`${API_BASE_URL}/employees/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        department,
        faceDescriptor: Array.from(faceDescriptor),
      }),
    })
    if (!response.ok) throw new Error("Failed to register employee")
    return response.json()
  },

  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/employees`, {
      method: "GET",
    })
    if (!response.ok) throw new Error("Failed to fetch employees")
    return response.json()
  },

  getById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "GET",
    })
    if (!response.ok) throw new Error("Failed to fetch employee")
    return response.json()
  },

  update: async (id, updates) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    })
    if (!response.ok) throw new Error("Failed to update employee")
    return response.json()
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/employees/${id}`, {
      method: "DELETE",
    })
    if (!response.ok) throw new Error("Failed to delete employee")
    return response.json()
  },
}
