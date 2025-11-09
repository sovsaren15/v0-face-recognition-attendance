"use client"

import { useRef, useState, useEffect } from "react"
import { loadFaceApiModels, detectFaces, compareFaces } from "../services/faceRecognition"
import { employeeAPI, attendanceAPI } from "../services/api"

// --- Location Configuration ---
const OFFICE_LOCATION = {
  latitude: 13.332962,
  longitude: 103.974389,
};
const MAX_DISTANCE_METERS = 700; // 100-meter radius

// --- Helper function to calculate distance between two GPS coordinates ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in meters
}

function AttendanceScanner() {
  const videoRef = useRef(null)
  const scanIntervalRef = useRef(null)
  const [scanning, setScanning] = useState(false)
  const [scanType, setScanType] = useState(null) // 'check-in' or 'check-out'
  const [employees, setEmployees] = useState([])
  const [lastScanned, setLastScanned] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isLocationValid, setIsLocationValid] = useState(false)
  const [locationMessage, setLocationMessage] = useState("")
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

        setLoading(false)
      } catch (error) {
        console.error("Initialization error:", error)
        setMessage("Failed to initialize scanner")
        setLoading(false)
      }
    }

    initializeScanner()

    return () => {
      clearInterval(scanIntervalRef.current) // Clear interval on component unmount
      stopCamera()
    }
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
      })
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        setIsCameraOpen(true)
        checkLocation() // Check location when camera opens
      }
    } catch (error) {
      console.error("Camera access denied:", error)
      setMessage("Camera access denied")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      videoRef.current.srcObject = null
      setIsCameraOpen(false)
      setIsLocationValid(false)
      setLocationMessage("")
      setScanning(false) // Stop scanning if camera is closed
    }
  }

  const checkLocation = () => {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported by your browser.")
      setIsLocationValid(false)
      return
    }

    setLocationMessage("Checking your location...")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const distance = getDistance(latitude, longitude, OFFICE_LOCATION.latitude, OFFICE_LOCATION.longitude)

        if (distance <= MAX_DISTANCE_METERS) {
          setLocationMessage("Location verified. You can now check in/out.")
          setIsLocationValid(true)
        } else {
          setLocationMessage(`You are too far from the office. Distance: ${distance.toFixed(0)} meters.`)
          setIsLocationValid(false)
        }
      },
      () => {
        setLocationMessage("Unable to retrieve your location. Please enable location services.")
        setIsLocationValid(false)
      }
    )
  }

  const startScanning = (type) => {
    if (!isLocationValid) {
      setMessage("Cannot scan: You are not at the required location.");
      return;
    }
    setScanType(type)
    setScanning(true)
    setMessage(`Scanning for ${type}...`);

    const scan = async () => {
      if (!videoRef.current) return;

      try {
        const detections = await detectFaces(videoRef.current);

        if (detections.length > 0) {
          // Stop scanning once a face is detected
          clearInterval(scanIntervalRef.current);
          setScanning(false);

          const detection = detections[0];
          const faceDescriptor = detection.descriptor;

          let matchedEmployee = null;
          for (const employee of employees) {
            if (!employee.faceDescriptor || typeof employee.faceDescriptor !== 'object') continue;
            const descriptorValues = Object.values(employee.faceDescriptor);
            const empDescriptor = new Float32Array(descriptorValues);

            if (compareFaces(faceDescriptor, empDescriptor, 0.55)) {
              matchedEmployee = employee;
              break;
            }
          }

          if (matchedEmployee) {
            try {
              const response = await attendanceAPI.markAttendance(matchedEmployee.id, type);
              setLastScanned({
                name: matchedEmployee.name,
                time: new Date().toLocaleTimeString(),
                type: type,
              });
              setMessage(`${type === 'check-in' ? 'Welcome' : 'Goodbye'}, ${matchedEmployee.name}! ${response.message}`);
              setTimeout(() => setMessage(""), 3000);
            } catch (error) {
              console.error("Error marking attendance:", error);
              if (error.response) {
                const errorData = await error.response.json();
                setMessage(errorData.error || "Error marking attendance");
              } else {
                setMessage("Error marking attendance");
              }
            }
          } else {
            setMessage("Face not recognized. Please try again.");
          }
        } else if (scanning) { // Only continue scanning if no face was found and we are still in scanning mode
          requestAnimationFrame(scan);
        }
      } catch (error) {
        console.error("Error during scan:", error);
        setMessage("An error occurred during scanning.");
        clearInterval(scanIntervalRef.current);
        setScanning(false);
      }
    };

    scan(); // Start the scan loop
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
          </div>

          {locationMessage && (
            <div
              className={`p-3 rounded-lg text-white text-center font-semibold text-sm ${
                isLocationValid ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {locationMessage}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 items-center">
            {!isCameraOpen ? (
              <button
                onClick={startCamera}
                className="w-full col-span-2 py-3 px-6 rounded-lg font-semibold text-white transition bg-blue-600 hover:bg-blue-700"
              >
                Open Camera
              </button>
            ) : (
              <button
                onClick={stopCamera}
                className="w-full col-span-2 py-3 px-6 rounded-lg font-semibold text-white transition bg-gray-600 hover:bg-gray-700"
              >
                Close Camera
              </button>
            )}

            <button
              onClick={() => startScanning("check-in")}
              disabled={scanning || !isCameraOpen || !isLocationValid}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                scanning || !isCameraOpen || !isLocationValid ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {scanning && scanType === 'check-in' ? "Scanning..." : "Check In"}
            </button>
            <button
              onClick={() => startScanning("check-out")}
              disabled={scanning || !isCameraOpen || !isLocationValid}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                scanning || !isCameraOpen || !isLocationValid ? "bg-gray-400 cursor-not-allowed" : "bg-red-600 hover:bg-red-700"
              }`}
            >
              {scanning && scanType === 'check-out' ? "Scanning..." : "Check Out"}
            </button>
          </div>

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
                <p className="text-lg text-gray-700">
                  <span className="font-semibold">Action:</span> <span className="capitalize">{lastScanned.type}</span>
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
