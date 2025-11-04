# Setup Guide

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Firebase Setup](#firebase-setup)
4. [Configuration](#configuration)
5. [Running the Application](#running-the-application)
6. [Building for Production](#building-for-production)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have the following installed on your system:

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| Node.js | >= 10.x | JavaScript runtime |
| npm | >= 6.x | Package manager |
| Git | >= 2.x | Version control |

### Verify Installation

```bash
# Check Node.js version
node --version
# Should output: v10.x.x or higher

# Check npm version
npm --version
# Should output: 6.x.x or higher

# Check Git version
git --version
# Should output: git version 2.x.x or higher
```

### Recommended Tools

- **Code Editor**: VS Code, WebStorm, or Sublime Text
- **Browser**: Chrome, Firefox, or Edge (with React DevTools extension)
- **Terminal**: iTerm2 (Mac), Windows Terminal, or integrated terminal

## Installation

### 1. Clone the Repository

```bash
# Clone via HTTPS
git clone https://github.com/yourusername/BurgerBuilderApp.git

# Or clone via SSH
git clone git@github.com:yourusername/BurgerBuilderApp.git

# Navigate to project directory
cd BurgerBuilderApp
```

### 2. Install Dependencies

```bash
# Install all project dependencies
npm install
```

This will install:
- React and React-DOM
- Redux and React-Redux
- Redux-Saga
- React Router
- Axios
- All development dependencies

**Expected Output**:
```
added 1847 packages from 685 contributors and audited 1847 packages in 45.678s
```

### 3. Verify Installation

```bash
# List installed packages
npm list --depth=0

# Should show all dependencies from package.json
```

## Firebase Setup

BurgerBuilderApp uses Firebase for backend services. You'll need to create a Firebase project.

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "burger-builder-app")
4. (Optional) Enable Google Analytics
5. Click "Create project"

### 2. Enable Authentication

1. In Firebase Console, click "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Click "Email/Password"
5. Enable "Email/Password"
6. Click "Save"

### 3. Create Realtime Database

1. In Firebase Console, click "Realtime Database"
2. Click "Create Database"
3. Select location (e.g., United States)
4. Start in **test mode** (for development)
5. Click "Enable"

### 4. Set Up Database Structure

Navigate to your database and create the following structure:

```json
{
  "ingredients": {
    "salad": 0,
    "bacon": 0,
    "cheese": 0,
    "meat": 0
  },
  "orders": {}
}
```

**Manual Steps**:
1. Click the `+` icon at root level
2. Name: `ingredients`, click `+`
3. Add child: `salad`, value: `0`
4. Repeat for `bacon`, `cheese`, `meat`
5. Click `+` at root level
6. Name: `orders`, leave empty

### 5. Configure Security Rules

Go to "Rules" tab and set:

**Development Rules** (Less secure, easier testing):
```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

**Production Rules** (Recommended):
```json
{
  "rules": {
    "ingredients": {
      ".read": true,
      ".write": false
    },
    "orders": {
      ".read": "auth != null",
      ".write": "auth != null",
      ".indexOn": ["userId"]
    }
  }
}
```

Click "Publish" to save rules.

### 6. Get API Credentials

1. Click gear icon ⚙️ → "Project settings"
2. In "General" tab, scroll to "Your apps"
3. Click web icon `</>`
4. Register app with nickname (e.g., "burger-builder-web")
5. Copy the config object:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "burger-builder-app.firebaseapp.com",
  databaseURL: "https://burger-builder-app.firebaseio.com",
  projectId: "burger-builder-app",
  storageBucket: "burger-builder-app.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

## Configuration

### 1. Update Axios Base URL

**File**: `/src/axios-orders.js`

```javascript
import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://YOUR-PROJECT-ID.firebaseio.com/'  // Update this
});

export default instance;
```

Replace `YOUR-PROJECT-ID` with your actual Firebase project ID from the config.

### 2. Update Authentication URLs

**File**: `/src/store/sagas/auth.js`

Update both URLs with your Firebase API key:

```javascript
// Sign up URL (line ~35)
let url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=YOUR_API_KEY';

// Sign in URL (line ~37)
if (!action.isSignup) {
  url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=YOUR_API_KEY';
}
```

Replace `YOUR_API_KEY` with your Firebase `apiKey` from the config.

### 3. Environment Variables (Optional but Recommended)

Create `.env` file in project root:

```bash
# .env
REACT_APP_FIREBASE_API_KEY=AIzaSyC...
REACT_APP_FIREBASE_DATABASE_URL=https://YOUR-PROJECT-ID.firebaseio.com
```

Update files to use environment variables:

**axios-orders.js**:
```javascript
const instance = axios.create({
  baseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL
});
```

**auth.js**:
```javascript
const apiKey = process.env.REACT_APP_FIREBASE_API_KEY;
let url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${apiKey}`;
```

**Important**: Add `.env` to `.gitignore`:
```bash
echo ".env" >> .gitignore
```

## Running the Application

### Development Server

```bash
# Start development server
npm start
```

**Expected Output**:
```
Compiled successfully!

You can now view burger-builder-app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.5:3000

Note that the development build is not optimized.
To create a production build, use npm run build.
```

The application will automatically open in your default browser at `http://localhost:3000`.

### Features of Development Server

- **Hot Reloading**: Changes auto-refresh the browser
- **Error Overlay**: Compilation errors displayed in browser
- **Source Maps**: Debug original source code
- **Redux DevTools**: Time-travel debugging (if extension installed)

### Access on Other Devices

To access the app from other devices on your network:

1. Note the "On Your Network" URL (e.g., `http://192.168.1.5:3000`)
2. Ensure devices are on the same WiFi network
3. Open that URL on mobile/tablet browser

## Building for Production

### Create Production Build

```bash
# Create optimized production build
npm run build
```

**Expected Output**:
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  68.45 KB  build/static/js/2.a1b2c3d4.chunk.js
  3.21 KB   build/static/js/main.e5f6g7h8.chunk.js
  1.42 KB   build/static/js/runtime-main.i9j0k1l2.js
  547 B     build/static/css/main.m3n4o5p6.chunk.css
```

### Build Output

```
build/
├── asset-manifest.json
├── favicon.ico
├── index.html
├── manifest.json
├── precache-manifest.*.js
├── service-worker.js
└── static/
    ├── css/
    │   └── *.chunk.css
    ├── js/
    │   ├── 2.*.chunk.js
    │   ├── main.*.chunk.js
    │   └── runtime-main.*.js
    └── media/
        └── logo.*
```

### Test Production Build Locally

```bash
# Install serve globally
npm install -g serve

# Serve production build
serve -s build

# Access at http://localhost:5000
```

### Deploy Production Build

#### Option 1: Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase Hosting
firebase init hosting

# Select:
# - What do you want to use as your public directory? → build
# - Configure as single-page app? → Yes
# - Overwrite index.html? → No

# Deploy
firebase deploy
```

#### Option 2: Netlify

1. Go to [Netlify](https://www.netlify.com/)
2. Click "New site from Git"
3. Connect GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `build`
5. Click "Deploy site"

#### Option 3: Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Follow prompts
```

## Troubleshooting

### Common Issues

#### 1. Port 3000 Already in Use

**Error**:
```
Something is already running on port 3000.
```

**Solution**:
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 npm start
```

#### 2. Module Not Found

**Error**:
```
Module not found: Can't resolve 'react'
```

**Solution**:
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall dependencies
npm install
```

#### 3. Firebase 401 Unauthorized

**Error**:
```
Request failed with status code 401
```

**Solution**:
- Check Firebase API key in `auth.js`
- Verify Authentication is enabled in Firebase Console
- Check browser console for detailed error message

#### 4. Firebase 403 Forbidden

**Error**:
```
Request failed with status code 403
```

**Solution**:
- Check Firebase Security Rules
- Verify token is being sent with requests
- Check if userId matches in security rules

#### 5. Ingredients Not Loading

**Error**:
```
Failed to load ingredients
```

**Solution**:
- Check Firebase Database URL in `axios-orders.js`
- Verify `/ingredients` exists in Firebase Database
- Check Firebase security rules allow read access

#### 6. Build Fails

**Error**:
```
Failed to compile
```

**Solution**:
```bash
# Clear cache
rm -rf node_modules/.cache

# Rebuild
npm run build
```

#### 7. Redux DevTools Not Working

**Solution**:
1. Install [Redux DevTools Extension](https://chrome.google.com/webstore/detail/redux-devtools/)
2. Restart browser
3. Open DevTools (F12)
4. Click "Redux" tab

### Performance Issues

#### Slow Development Server

**Solutions**:
- Close unused applications
- Increase Node.js memory: `NODE_OPTIONS=--max_old_space_size=4096 npm start`
- Disable source maps in `package.json` (not recommended)

#### Large Bundle Size

**Solutions**:
- Run `npm run build` to see bundle analysis
- Lazy load more routes
- Check for duplicate dependencies: `npm dedupe`

### Getting Help

If issues persist:

1. **Check Console Logs**: Browser DevTools (F12) → Console
2. **Check Network Tab**: DevTools → Network
3. **Check Redux State**: Redux DevTools → State
4. **Check Firebase Logs**: Firebase Console → Logs
5. **Search Issues**: GitHub repository issues page
6. **Ask Community**: Stack Overflow with `reactjs` and `firebase` tags

### Useful Commands

```bash
# Clear npm cache
npm cache clean --force

# Update npm
npm install -g npm@latest

# Check outdated packages
npm outdated

# Update packages
npm update

# Audit for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

---

**Last Updated**: 2025-11-04
