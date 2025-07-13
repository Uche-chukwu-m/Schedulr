# Deployment Guide for Schedulr

## Deploying to Render

### Prerequisites
- A Render account
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

### Steps to Deploy

1. **Connect your repository to Render:**
   - Go to your Render dashboard
   - Click "New +" and select "Web Service"
   - Connect your Git repository
   - Select the repository containing your Schedulr project

2. **Configure the deployment:**
   - **Name:** `schedulr` (or your preferred name)
   - **Environment:** `Python`
   - **Build Command:** 
     ```bash
     pip install -r requirements.txt
     cd frontend && npm install && npm run build
     ```
   - **Start Command:** 
     ```bash
     cd backend && python app.py
     ```

3. **Environment Variables (optional):**
   - `PYTHON_VERSION`: `3.9.16`

4. **Deploy:**
   - Click "Create Web Service"
   - Render will automatically build and deploy your application

### What was fixed

The main issue you encountered was related to how Flask was serving the frontend files. The changes made:

1. **Removed static folder configuration** from Flask app initialization
2. **Added explicit routes** for serving static files with proper MIME types:
   - `/assets/<filename>` for JavaScript and CSS files
   - `/vite.svg` for the favicon
   - Root route serves `index.html` for React routing

3. **Updated production settings:**
   - Uses environment variable for port (Render requirement)
   - Disabled debug mode for production
   - Added proper host binding

### Alternative: Manual Deployment

If you prefer to deploy manually without the `render.yaml` file:

1. Push your code to your repository
2. In Render dashboard, create a new Web Service
3. Use the build and start commands mentioned above
4. Deploy

### Troubleshooting

If you still encounter MIME type issues:
1. Ensure the frontend is built (`npm run build` in frontend directory)
2. Check that the `dist` folder contains the built files
3. Verify the Flask routes are correctly serving the static files

The application should now work correctly on Render without MIME type errors! 