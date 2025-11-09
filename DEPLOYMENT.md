# Deployment Guide

## Backend Deployment (Node.js + Express)

### Option 1: Deploy to Heroku

1. Create a Heroku account
2. Install Heroku CLI
3. Run `heroku create your-app-name`
4. Set environment variables: `heroku config:set FIREBASE_PROJECT_ID=...`
5. Deploy: `git push heroku main`

### Option 2: Deploy to Railway, Render, or Similar

1. Connect your GitHub repository
2. Add environment variables
3. Configure start command: `npm start`

## Frontend Deployment (React)

### Option 1: Deploy to Vercel

\`\`\`bash
npm install -g vercel
vercel
\`\`\`

### Option 2: Deploy to Netlify

1. Build the app: `npm run build`
2. Connect GitHub to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `build`

### Option 3: Deploy to Firebase Hosting

\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
\`\`\`

## Environment Variables for Production

### Backend
\`\`\`
NODE_ENV=production
PORT=5000 (or assigned by platform)
All Firebase credentials
JWT_SECRET=secure_random_string
\`\`\`

### Frontend
\`\`\`
REACT_APP_API_URL=https://your-backend-url/api
\`\`\`

## Database Initialization

1. Your Firebase project is already configured
2. Collections will be created automatically on first write
3. Ensure Firebase security rules are properly configured

## Post-Deployment Checklist

- [ ] Backend API is accessible
- [ ] Frontend can communicate with backend
- [ ] Camera permissions work in browser
- [ ] Face detection models load correctly
- [ ] Database operations work
- [ ] CORS is properly configured
