"use client"

import { useState, useEffect } from "react"
import { employeeAPI } from "../services/api"

function EmployeeList() {
  const [employees, setEmployees] = useState([])
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchEmployees()
  }, [])

  const fetchEmployees = async () => {
    try {
      const response = await employeeAPI.getAll()
      if (response.success) {
        setEmployees(response.employees)
      }
      setLoading(false)
    } catch (error) {
      console.error("Error fetching employees:", error)
      setMessage("Failed to load employees")
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeeAPI.delete(id)
        setEmployees(employees.filter((e) => e.id !== id))
        setMessage("Employee deleted successfully")
        setTimeout(() => setMessage(""), 3000)
      } catch (error) {
        console.error("Error deleting employee:", error)
        setMessage("Failed to delete employee")
      }
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
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Employees</h2>

      {message && <div className="mb-4 bg-green-50 p-4 rounded-lg text-green-700">{message}</div>}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Department</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Registered</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{employee.name}</td>
                <td className="px-4 py-3 text-gray-600">{employee.email}</td>
                <td className="px-4 py-3 text-gray-600">{employee.department}</td>
                <td className="px-4 py-3 text-gray-600">
                  {employee.registeredAt ? new Date(employee.registeredAt).toLocaleDateString() : 'N/A'}
                </td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleDelete(employee.id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {employees.length === 0 && <div className="text-center py-8 text-gray-500">No employees registered yet.</div>}
    </div>
  )
}

export default EmployeeList
