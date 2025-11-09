"use client"

import { useRef, useState, useEffect } from "react"
import { loadFaceApiModels, detectFaces } from "../services/faceRecognition"
import { employeeAPI } from "../services/api"

function EmployeeRegistration() {
  const videoRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
  })
  const [capturing, setCapturing] = useState(false)
  const [faceData, setFaceData] = useState(null)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initCamera = async () => {
      const loaded = await loadFaceApiModels()
      if (!loaded) {
        setMessage("Failed to load face models")
        return
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (error) {
        setMessage("Camera access denied")
      }
      setLoading(false)
    }

    initCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const captureFace = async () => {
    if (!videoRef.current) return

    try {
      setCapturing(true)
      const detections = await detectFaces(videoRef.current)

      if (detections.length === 0) {
        setMessage("No face detected. Please try again.")
        setCapturing(false)
        return
      }

      if (detections.length > 1) {
        setMessage("Multiple faces detected. Please capture one face at a time.")
        setCapturing(false)
        return
      }

      const descriptor = detections[0].descriptor
      setFaceData(descriptor)
      setMessage("Face captured successfully!")
      setCapturing(false)
    } catch (error) {
      console.error("Error capturing face:", error)
      setMessage("Error capturing face")
      setCapturing(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!faceData || !formData.name || !formData.email) {
      setMessage("Please fill all fields and capture a face")
      return
    }

    try {
      const response = await employeeAPI.register(
        formData.name,
        formData.email,
        formData.department || "General",
        faceData,
      )

      if (response.success) {
        setMessage("Employee registered successfully!")
        setFormData({ name: "", email: "", department: "" })
        setFaceData(null)
        setTimeout(() => setMessage(""), 3000)
      }
    } catch (error) {
      console.error("Registration error:", error)
      setMessage("Failed to register employee")
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
      <h2 className="text-3xl font-bold mb-8 text-gray-800">Employee Registration</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video Feed */}
        <div className="flex flex-col gap-4">
          <div className="bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline className="w-full h-96 object-cover" />
          </div>

          <button
            onClick={captureFace}
            disabled={capturing}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              capturing ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {capturing ? "Capturing..." : "Capture Face"}
          </button>

          {faceData && (
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-green-700 font-semibold">Face captured successfully!</p>
            </div>
          )}

          {message && <div className="bg-blue-50 p-4 rounded-lg text-center text-blue-700">{message}</div>}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="John Doe"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="john@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Engineering"
            />
          </div>

          <button
            type="submit"
            disabled={!faceData || !formData.name || !formData.email}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              !faceData || !formData.name || !formData.email
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Register Employee
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmployeeRegistration
