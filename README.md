# Smart Attendance System - Face Recognition

A comprehensive employee attendance management system using face recognition technology, built with React.js, Express.js, Node.js, Tailwind CSS, and Firebase.

## Features

✨ **Face Recognition Based Attendance**
- Real-time face detection using face-api.js
- Automatic employee identification
- Accurate face matching with confidence thresholds

📊 **Employee Management**
- Employee registration with facial data capture
- Employee database with search and filtering
- Soft delete functionality

📈 **Dashboard & Analytics**
- Real-time attendance tracking
- Daily attendance statistics
- Attendance rate calculation
- Attendance history

🔒 **Security**
- Firebase authentication ready
- Face descriptor encryption
- Environment variable protection

## Tech Stack

**Backend:**
- Node.js + Express.js
- Firebase (Firestore + Authentication)
- RESTful API

**Frontend:**
- React.js
- Tailwind CSS
- face-api.js (for face recognition)
- React Router

**Database:**
- Firebase Firestore

## Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn
- Webcam enabled
- Firebase account and project (provided in the setup)

### Installation

1. **Clone and Install Backend**
\`\`\`bash
cd backend
npm install
\`\`\`

2. **Configure Firebase**
- Add your Firebase credentials to `.env` file (see SETUP_GUIDE.md)

3. **Start Backend**
\`\`\`bash
npm start
\`\`\`

4. **Install Frontend**
\`\`\`bash
cd ../frontend
npm install
\`\`\`

5. **Start Frontend**
\`\`\`bash
npm start
\`\`\`

Visit `http://localhost:3000` in your browser.

## Project Structure

\`\`\`
smart-attendance/
├── backend/
│   ├── config/           # Firebase configuration
│   ├── controllers/       # Business logic
│   ├── routes/           # API routes
│   └── server.js         # Express server
└── frontend/
    ├── src/
    │   ├── pages/        # React pages
    │   ├── services/     # API and face recognition services
    │   └── App.js        # Main app component
    ├── public/           # Static assets
    └── package.json
\`\`\`

## API Documentation

### Authentication Endpoints
- `POST /api/employees/register` - Register new employee
- `GET /api/employees` - Get all employees
- `GET /api/employees/:id` - Get single employee

### Attendance Endpoints
- `POST /api/attendance/mark` - Mark attendance
- `GET /api/attendance/employee/:employeeId` - Get attendance records
- `GET /api/attendance/today` - Get today's attendance

## How to Use

### 1. Register an Employee
1. Go to "Register" page
2. Enter employee details (name, email, department)
3. Click "Capture Face" and position your face in the camera
4. Click "Register Employee"

### 2. Mark Attendance
1. Go to "Scanner" page
2. Click "Scan Face"
3. Position your face in the camera
4. System will identify and mark your attendance

### 3. View Dashboard
1. Go to "Dashboard" page
2. View today's attendance statistics
3. See all employees present today

### 4. Manage Employees
1. Go to "Employees" page
2. View all registered employees
3. Delete employees if needed

## Configuration

### Backend Environment Variables
\`\`\`env
PORT=5000
FIREBASE_PROJECT_ID=attendance2-b7627
FIREBASE_TYPE=service_account
FIREBASE_PRIVATE_KEY_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_CLIENT_ID=...
FIREBASE_AUTH_URI=...
FIREBASE_TOKEN_URI=...
FIREBASE_AUTH_PROVIDER_X509_CERT_URL=...
FIREBASE_CLIENT_X509_CERT_URL=...
JWT_SECRET=your_secret_key
NODE_ENV=development
\`\`\`

### Frontend Environment Variables
\`\`\`env
REACT_APP_API_URL=http://localhost:5000/api
\`\`\`

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## Security Considerations

1. **Credentials**: Never commit `.env` files
2. **Face Data**: Face descriptors are stored encrypted in Firebase
3. **HTTPS**: Always use HTTPS in production
4. **CORS**: Properly configure CORS for your domain
5. **Rate Limiting**: Implement rate limiting in production

## Troubleshooting

### Camera Not Accessible
- Check browser permissions
- Try using HTTPS
- Check if another application is using camera

### Face Detection Issues
- Ensure good lighting
- Keep face clearly visible
- Try different angles
- Ensure minimum face size in frame

### API Connection Error
- Verify backend is running on port 5000
- Check REACT_APP_API_URL configuration
- Check browser console for CORS errors

## Performance Optimization

1. Face models are loaded from CDN
2. Efficient face descriptor comparison
3. Lazy loading of components
4. Firebase queries are optimized

## Future Enhancements

- Multi-factor authentication
- Advanced attendance reports
- Leave management
- Biometric liveness detection
- Mobile app version
- Email notifications
- Historical analytics

## License

MIT

## Support

For issues and support, please refer to SETUP_GUIDE.md and check the Troubleshooting section.
