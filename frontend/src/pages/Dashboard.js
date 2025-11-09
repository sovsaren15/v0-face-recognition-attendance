"use client"

import { useState, useEffect } from "react"
import { attendanceAPI, employeeAPI } from "../services/api"

function Dashboard() {
  const [todayAttendance, setTodayAttendance] = useState([])
  const [employeeCount, setEmployeeCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [employeeMap, setEmployeeMap] = useState({})

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [attendanceRes, employeesRes] = await Promise.all([
        attendanceAPI.getTodayAttendance(),
        employeeAPI.getAll(),
      ])

      if (attendanceRes.success) {
        setTodayAttendance(attendanceRes.attendance || [])
      }

      if (employeesRes.success) {
        setEmployeeCount(employeesRes.employees.length)
        const map = {}
        employeesRes.employees.forEach((emp) => {
          map[emp.id] = emp
        })
        setEmployeeMap(map)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Total Employees</h3>
          <p className="text-4xl font-bold text-indigo-600">{employeeCount}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Present Today</h3>
          <p className="text-4xl font-bold text-green-600">{todayAttendance.length}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-600 text-sm font-semibold mb-2">Attendance Rate</h3>
          <p className="text-4xl font-bold text-blue-600">
            {employeeCount > 0 ? Math.round((todayAttendance.length / employeeCount) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Today's Attendance */}
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Today's Attendance</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Employee</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Check In</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Check Out</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Time Status</th>
              </tr>
            </thead>
            <tbody>
              {todayAttendance.map((record) => (
                <tr key={record.id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800">{employeeMap[record.employeeId]?.name || "Unknown"}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.checkIn ? new Date(record.checkIn).toLocaleTimeString() : "N/A"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {record.checkOut ? new Date(record.checkOut).toLocaleTimeString() : "Pending"}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        record.status === "completed" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {record.timeStatus && (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          record.timeStatus === "Late"
                            ? "bg-red-100 text-red-800"
                            : record.timeStatus === "Good"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >{record.timeStatus}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {todayAttendance.length === 0 && (
          <div className="text-center py-8 text-gray-500">No attendance records for today.</div>
        )}
      </div>
    </div>
  )
}

export default Dashboard
