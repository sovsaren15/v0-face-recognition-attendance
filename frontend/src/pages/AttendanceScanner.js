"use client"

import { useRef, useState, useEffect } from "react"
import { loadFaceApiModels, detectFaces, compareFaces } from "../services/faceRecognition"
import { employeeAPI, attendanceAPI } from "../services/api"

function AttendanceScanner() {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [employees, setEmployees] = useState([])
  const [lastScanned, setLastScanned] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    const initializeScanner = async () => {
      try {
        const loaded = await loadFaceApiModels()
        if (!loaded) throw new Error("Failed to load face models")

        const response = await employeeAPI.getAll()
        if (response.success) {
          setEmployees(response.employees)
        }

        startCamera()
        setLoading(false)
      } catch (error) {
        console.error("Initialization error:", error)
        setMessage("Failed to initialize scanner")
        setLoading(false)
      }
    }

    initializeScanner()

    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setMessage("Camera access denied")
    }
  }

  const startScanning = () => {
    setScanning(true)
    setMessage("Scanning for face...")
    scanForFace()
  }

  const scanForFace = async () => {
    if (!scanning || !videoRef.current) return

    try {
      const detections = await detectFaces(videoRef.current)

      if (detections.length > 0) {
        const detection = detections[0]
        const faceDescriptor = detection.descriptor

        let matchedEmployee = null
        for (const employee of employees) {
          const empDescriptor = new Float32Array(employee.faceDescriptor)
          if (compareFaces(faceDescriptor, empDescriptor, 0.55)) {
            matchedEmployee = employee
            break
          }
        }

        if (matchedEmployee) {
          try {
            await attendanceAPI.markAttendance(matchedEmployee.id, faceDescriptor, new Date().toISOString())
            setLastScanned({
              name: matchedEmployee.name,
              time: new Date().toLocaleTimeString(),
            })
            setMessage(`Welcome, ${matchedEmployee.name}!`)
            setScanning(false)
            setTimeout(() => setMessage(""), 3000)
          } catch (error) {
            console.error("Error marking attendance:", error)
            setMessage("Error marking attendance")
          }
        } else {
          setMessage("Face not recognized")
        }

        setScanning(false)
      } else {
        requestAnimationFrame(scanForFace)
      }
    } catch (error) {
      console.error("Error scanning:", error)
      setScanning(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-center">
          <div className="mb-4 text-xl text-gray-700">Loading face recognition models...</div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Attendance Scanner</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Video Feed */}
        <div className="flex flex-col gap-4">
          <div className="bg-black rounded-lg overflow-hidden relative">
            <video ref={videoRef} autoPlay playsInline className="w-full h-80 object-cover" />
            <canvas ref={canvasRef} className="absolute top-0 left-0" style={{ display: "none" }} />
          </div>

          <button
            onClick={startScanning}
            disabled={scanning}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              scanning ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {scanning ? "Scanning..." : "Scan Face"}
          </button>

          {message && (
            <div
              className={`p-4 rounded-lg text-white text-center font-semibold ${
                message.includes("Welcome") ? "bg-green-500" : "bg-blue-500"
              }`}
            >
              {message}
            </div>
          )}
        </div>

        {/* Last Scanned */}
        <div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Last Scanned</h3>
            {lastScanned ? (
              <div className="space-y-2">
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Name:</span> {lastScanned.name}
                </p>
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Time:</span> {lastScanned.time}
                </p>
              </div>
            ) : (
              <p className="text-gray-500 italic">No employee scanned yet</p>
            )}
          </div>

          <div className="mt-6 bg-blue-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Registered Employees</h3>
            <p className="text-2xl font-bold text-indigo-600">{employees.length}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AttendanceScanner
