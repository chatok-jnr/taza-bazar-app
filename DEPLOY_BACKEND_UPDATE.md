# 🚀 Backend Deployment Update

## ⚠️ Important: Backend CORS Update Required

Your backend CORS configuration has been updated to allow requests from any origin.

### What Changed

**File:** `backend/app.js`

The CORS configuration was changed from:
```javascript
origin: 'http://localhost:5173'
```

To:
```javascript
origin: '*'  // Allows all origins
```

This allows your frontend (from anywhere) to make API requests to your backend.

## How to Deploy the Update to Render

### Option 1: Automatic Deployment (if you have GitHub connected)

1. Commit the changes:
   ```bash
   cd f:\TazaBazar\taza-bazar-app
   git add backend/app.js
   git commit -m "Update CORS to allow all origins"
   git push origin main
   ```

2. Render will automatically deploy the update

### Option 2: Manual Deployment

1. Go to https://dashboard.render.com
2. Find your `taza-bazar-app-backend` service
3. Click "Manual Deploy" > "Deploy latest commit"
4. Wait for deployment to complete

### Verify Backend is Updated

1. Wait for deployment to finish
2. Check your backend URL: https://taza-bazar-app-backend.onrender.com
3. Look for "Service Live" or similar status

## Test Your Frontend

After backend is redeployed:

```bash
cd frontend
npm run dev
```

Then test:
- ✅ Login
- ✅ Signup
- ✅ Creating listings/requests
- ✅ Viewing marketplace

## Optional: More Secure CORS (Recommended for Production)

If you want to limit CORS to specific domains (more secure):

Edit `backend/app.js`:
```javascript
app.use(
  cors({
    origin: ['http://localhost:5173', 'https://your-frontend-url.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
```

Replace `https://your-frontend-url.com` with your actual frontend deployment URL.
