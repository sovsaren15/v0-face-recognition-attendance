import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navRef = useRef(null)

  const toggleMobileMenu = () => setIsMobileMenuOpen((s) => !s)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav ref={navRef} className="bg-white shadow-lg relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3">
              <img src="/images/logo.png" alt="Logo" className="h-8 w-auto" />
              <h1 className="text-2xl font-bold text-indigo-600">Smart Attendance</h1>
            </Link>
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
              <Link to="/records" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                Records
              </Link>
              <Link to="/top" className="px-4 py-2 text-gray-700 hover:text-indigo-600 transition">
                Top
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleMobileMenu()
              }}
              className="p-2 rounded-md text-gray-700 hover:text-indigo-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMobileMenuOpen ? (
                  <path d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu with simple transition */}
      <div
        className={`md:hidden absolute w-full bg-white shadow-lg z-50 transform transition-transform duration-150 ease-in-out ${
          isMobileMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Scanner
          </Link>
          <Link
            to="/register"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/employees"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Employees
          </Link>
          <Link
            to="/dashboard"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/records"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Records
          </Link>
          <Link
            to="/top"
            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Top
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
