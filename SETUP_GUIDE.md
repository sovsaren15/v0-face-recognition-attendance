# Smart Attendance System - Setup Guide

## Project Structure

\`\`\`
smart-attendance/
├── backend/
│   ├── config/
│   │   └── firebase.js
│   ├── controllers/
│   │   ├── attendanceController.js
│   │   └── employeeController.js
│   ├── routes/
│   │   ├── attendance.js
│   │   └── employees.js
│   ├── server.js
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── AttendanceScanner.js
    │   │   ├── EmployeeRegistration.js
    │   │   ├── EmployeeList.js
    │   │   └── Dashboard.js
    │   ├── services/
    │   │   ├── faceRecognition.js
    │   │   └── api.js
    │   ├── App.js
    │   ├── index.js
    │   └── index.css
    ├── public/
    │   └── index.html
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
\`\`\`

## Backend Setup

### 1. Install Dependencies

\`\`\`bash
cd backend
npm install
\`\`\`

### 2. Configure Environment Variables

Create a `.env` file in the backend directory with your Firebase credentials:

\`\`\`env
PORT=5000
FIREBASE_PROJECT_ID=attendance2-b7627
FIREBASE_TYPE=service_account
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
FIREBASE_CLIENT_X509_CERT_URL=your_cert_url
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
\`\`\`

### 3. Start Backend Server

\`\`\`bash
npm start
\`\`\`

The backend will run on http://localhost:5000

## Frontend Setup

### 1. Install Dependencies

\`\`\`bash
cd frontend
npm install
\`\`\`

### 2. Configure API URL

Update the `API_BASE_URL` in `frontend/src/services/api.js`:

\`\`\`javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
\`\`\`

### 3. Start Frontend Development Server

\`\`\`bash
npm start
\`\`\`

The frontend will run on http://localhost:3000

## Features

### Attendance Scanner
- Real-time face detection using face-api.js
- Automatic employee identification
- Attendance recording to Firebase
- Last scanned employee display

### Employee Registration
- Capture employee face for registration
- Store face descriptors in Firebase
- Store employee information (name, email, department)

### Employee Management
- View all registered employees
- Delete employees (soft delete)
- View employee details

### Dashboard
- Today's attendance statistics
- Attendance rate calculation
- Real-time attendance records
- Employee count tracking

## API Endpoints

### Attendance
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/employee/:employeeId` - Get employee attendance records
- `GET /api/attendance/today` - Get today's attendance
- `DELETE /api/attendance/:id` - Delete attendance record

### Employees
- `POST /api/employees/register` - Register new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee
- `PUT /api/employees/:id` - Update employee
- `DELETE /api/employees/:id` - Delete employee

## Troubleshooting

### Camera Not Working
- Check browser permissions for camera access
- Ensure HTTPS is used in production
- Try different browser

### Face Not Detected
- Ensure good lighting
- Position face clearly in camera view
- Keep face within camera frame

### API Connection Issues
- Verify backend is running on port 5000
- Check CORS configuration in backend
- Ensure API_BASE_URL is correct

## Security Notes

- Store Firebase credentials securely
- Use environment variables for sensitive data
- Implement proper authentication for admin routes
- Use HTTPS in production
- Implement rate limiting on API endpoints
