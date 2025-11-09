"use client"

import { useState } from "react"
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import AttendanceScanner from "./pages/AttendanceScanner"
import EmployeeRegistration from "./pages/EmployeeRegistration"
import Dashboard from "./pages/Dashboard"
import EmployeeList from "./pages/EmployeeList"
import "./App.css"

function App() {
  const [isModelsLoaded, setIsModelsLoaded] = useState(false)

  return (
    <Router>
      <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Navigation */}
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-8">
                <h1 className="text-2xl font-bold text-indigo-600">Smart Attendance</h1>
                <div className="hidden md:flex gap-4">
                  <Link to="/" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                    Scanner
                  </Link>
                  <Link to="/register" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                    Register
                  </Link>
                  <Link to="/employees" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                    Employees
                  </Link>
                  <Link to="/dashboard" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Routes */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<AttendanceScanner />} />
            <Route path="/register" element={<EmployeeRegistration />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App
