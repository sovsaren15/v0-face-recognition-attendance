"use client"

import { useRef, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { loadFaceApiModels, detectFaces } from "../services/faceRecognition"
import { employeeAPI } from "../services/api"

function EmployeeRegistration() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const imageRef = useRef(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "",
    dob: "",
    startWorkingDate: "",
    sex: "",
  })
  const [capturing, setCapturing] = useState(false)
  const [faceData, setFaceData] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [uploadedImage, setUploadedImage] = useState(null)

  useEffect(() => {
    const initCamera = async () => {
      const loaded = await loadFaceApiModels()
      if (!loaded) {
        setMessage("Failed to load face models")
        return
      }
      await startCamera()
      setLoading(false)
    }

    initCamera()

    return () => {
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
      }
    } catch (error) {
      setMessage("Camera access denied. Please allow camera access in your browser settings.")
    }
  }

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }

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

      // Convert Float32Array to a regular array to ensure it's JSON serializable
      setFaceData(Array.from(detections[0].descriptor))
      setMessage("Face captured successfully!")
      setCapturing(false)
    } catch (error) {
      console.error("Error capturing face:", error)
      setMessage("Error capturing face")
      setCapturing(false)
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Stop camera to prevent both from running
    stopCamera()

    const imageUrl = URL.createObjectURL(file)
    setUploadedImage(imageUrl)
    setFaceData(null) // Reset previous face data

    // We need to use an Image element for face-api
    const imageElement = document.createElement("img")
    imageElement.src = imageUrl

    imageElement.onload = async () => {
      try {
        setCapturing(true)
        setMessage("Detecting face from image...")
        const detections = await detectFaces(imageElement)

        if (detections.length === 0) {
          setMessage("No face detected in the image. Please try another one.")
        } else if (detections.length > 1) {
          setMessage("Multiple faces detected. Please use an image with only one face.")
        } else {
          // Convert Float32Array to a regular array
          setFaceData(Array.from(detections[0].descriptor))
          setMessage("Face captured successfully from image!")
        }
      } catch (error) {
        console.error("Error detecting face from image:", error)
        setMessage("Error processing image for face detection.")
      } finally {
        setCapturing(false)
        // The URL is not revoked here so the image preview remains visible.
        // It will be cleaned up when the component unmounts or a new image is uploaded.
      }
    }

    // Clear the file input value to allow re-uploading the same file
    e.target.value = ""
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
      setIsSubmitting(true)
      // Construct the data object carefully to avoid sending empty strings for optional fields
      const registrationData = {
        name: formData.name,
        email: formData.email,
        department: formData.department || "General",
        faceDescriptor: faceData,
      }

      if (formData.dob) registrationData.dob = formData.dob;
      if (formData.startWorkingDate) registrationData.startWorkingDate = formData.startWorkingDate;
      if (formData.sex) registrationData.sex = formData.sex;
      
      const response = await employeeAPI.register(registrationData)

      if (response.success) {
        setMessage("Employee registered successfully! Redirecting to employee list...")
        // Redirect to the employee list page after a short delay
        setTimeout(() => {
          navigate("/employees")
        }, 2000)
      }
    } catch (error) {
      console.error("Registration error:", error)
      // Check if the error object has a response with a JSON body
      if (error.response && typeof error.response.json === 'function') {
        const errorData = await error.response.json();
        setMessage(errorData.error || "Failed to register employee. Please try again.");
      } else {
        setMessage(error.message || "Failed to register employee. An unknown error occurred.");
      }
    } finally {
      setIsSubmitting(false)
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
          <div className="bg-black rounded-lg overflow-hidden relative h-96 flex items-center justify-center">
            {uploadedImage ? (
              <img ref={imageRef} src={uploadedImage} alt="Uploaded preview" className="h-full w-full object-contain" />
            ) : (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={captureFace}
              disabled={capturing || !!uploadedImage}
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
                capturing || uploadedImage
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {capturing ? "Capturing..." : "Capture from Camera"}
            </button>

            <label
              htmlFor="imageUpload"
              className={`w-full py-3 px-6 rounded-lg font-semibold text-white text-center transition cursor-pointer ${
                capturing ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              Upload Image
            </label>
            <input id="imageUpload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
          </div>

          {uploadedImage && (
            <button
              onClick={() => {
                setUploadedImage(null)
                setFaceData(null)
                setMessage("")
                startCamera()
                if (uploadedImage) URL.revokeObjectURL(uploadedImage)
              }}
              className="w-full py-2 px-4 rounded-lg font-semibold text-white bg-gray-600 hover:bg-gray-700 transition"
            >
              Switch to Camera
            </button>
          )}

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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Gender</label>
              <select
                name="sex"
                value={formData.sex}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white"
              >
                <option value="">Select...</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Start Working Date</label>
            <input
              type="date"
              name="startWorkingDate"
              value={formData.startWorkingDate}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
          </div>

          <button
            type="submit"
            disabled={!faceData || !formData.name || !formData.email || isSubmitting}
            className={`w-full py-3 px-6 rounded-lg font-semibold text-white transition ${
              !faceData || !formData.name || !formData.email || isSubmitting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            } flex items-center justify-center`}
          >
            {isSubmitting && (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            )}
            {isSubmitting ? "Registering..." : "Register Employee"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default EmployeeRegistration
