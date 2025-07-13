# Deployment Guide for Schedulr on Render

## Issues Fixed

1. **Static File Serving**: Updated Flask routes to handle cases where frontend dist folder doesn't exist
2. **Database Configuration**: Properly configured PostgreSQL database connection
3. **Health Check**: Added `/api/health` endpoint for debugging
4. **Build Process**: Ensured proper build commands for both backend and frontend

## Deployment Steps

1. **Create a new Web Service on Render**:
   - Connect your GitHub repository
   - Use the `render.yaml` configuration

2. **Database Setup**:
   - The `render.yaml` will automatically create a PostgreSQL database
   - The `DATABASE_URL` environment variable will be automatically configured

3. **Build Process**:
   - Backend: Installs Python dependencies from `requirements.txt`
   - Frontend: Installs npm packages and builds the React app

## Troubleshooting

### Bad Gateway Error

If you're still getting a "Bad Gateway" error:

1. **Check the logs** in your Render dashboard
2. **Test the health endpoint**: Visit `https://your-app.onrender.com/api/health`
3. **Test the basic endpoint**: Visit `https://your-app.onrender.com/api/test`

### Common Issues

1. **Database Connection**: Make sure the PostgreSQL database is created and running
2. **Build Failures**: Check if npm install or build commands are failing
3. **Port Configuration**: The app uses the `PORT` environment variable (Render requirement)

### Manual Database Setup

If the automatic database creation doesn't work:

1. Create a PostgreSQL database manually in Render
2. Update the `DATABASE_URL` environment variable in your web service settings
3. The connection string should look like: `postgresql://user:password@host:port/database`

## Environment Variables

- `PORT`: Automatically set by Render
- `DATABASE_URL`: Automatically set when database is created
- `PYTHON_VERSION`: Set to 3.9.16

## Testing Locally

To test the deployment locally:

```bash
# Backend
cd backend
pip install -r requirements.txt
python app.py

# Frontend (in another terminal)
cd frontend
npm install
npm run build
```

The app should be available at `http://localhost:5000` 