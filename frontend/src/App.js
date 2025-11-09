// Import useLocation from react-router-dom
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import Navbar from "./components/Navbar"
import EmployeeRegistration from "./pages/EmployeeRegistration"
import Dashboard from "./pages/Dashboard"
import EmployeeList from "./pages/EmployeeList"
import AttendancePage from "./pages/AttendancePage"
import TopPerformers from "./pages/TopPerformers"
import HomePage from "./pages/HomePage"
import "./App.css"

// New component to hold your main app content
function AppContent() {
  const location = useLocation() // <-- Get current location

  return (
    <div className="App min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation */}
      {/* Render Navbar on all pages except the homepage ('/') and records page */}
      {location.pathname !== "/" && location.pathname !== "/records" && <Navbar />}

      {/* Routes */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<EmployeeRegistration />} />
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/records" element={<AttendancePage />} />
          <Route path="/top" element={<TopPerformers />} />
        </Routes>
      </main>
    </div>
  )
}

// Your original App component now just wraps AppContent with the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App