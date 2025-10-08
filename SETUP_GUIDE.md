# 🚀 Waste Management App - Setup Guide

## ✅ Current Status
Your app is **already well-structured** with:
- ✅ Backend API (Express.js + MySQL2)
- ✅ Frontend (HTML/JS) with authentication
- ✅ Database routes for all features
- ✅ S3 integration for image uploads

## 🔧 Step 1: Configure Environment Variables

1. **Update `config.env`** with your actual RDS credentials:
```bash
# Replace these with your actual RDS values
DB_HOST=your-actual-rds-endpoint.rds.amazonaws.com
DB_USER=admin
DB_PASSWORD=your-actual-password
DB_NAME=wastemanagement
```

2. **Copy config.env to .env**:
```bash
cp config.env .env
```

## 🧪 Step 2: Test Database Connection

Run the database connection test:
```bash
node test-db-connection.js
```

Expected output:
```
✅ Successfully connected to RDS database!
📊 Database stats:
   Users: 0
   Complaints: 0
   Bins: 0
```

## 🚀 Step 3: Start the Backend Server

```bash
npm start
```

Expected output:
```
Server running on port 3000
```

## 🌐 Step 4: Test the Frontend

1. Open `public/auth.html` in your browser
2. Create a new account (signup)
3. Login with your credentials
4. Navigate through the app:
   - Home page (shows stats)
   - Submit complaints
   - View schedules
   - Check bins/sensors
   - Rate areas

## 🔍 Step 5: Verify Data Flow

1. **Check RDS Database**:
   - Login to MySQL Workbench
   - Connect to your RDS instance
   - Run: `SELECT * FROM users;`
   - Run: `SELECT * FROM complaints;`

2. **Check S3 Bucket**:
   - Login to AWS Console
   - Go to S3 → your bucket
   - Check `complaints/` folder for uploaded images

## 🎯 Your App Features

### ✅ Authentication System
- User signup/login
- JWT token-based auth
- Protected routes

### ✅ Complaint Management
- Submit complaints with photos
- Upload images to S3
- View complaint history
- Real-time status updates

### ✅ Schedule Management
- Search garbage collection schedules
- Filter by area and day
- Display collection times

### ✅ Bin Monitoring
- View bin fill levels
- Check last emptied times
- Monitor sensor data

### ✅ Rating System
- Rate area cleanliness
- Submit feedback
- View community ratings

## 🚀 Next Steps (Cloud Deployment)

Once local testing works:

1. **Deploy Backend to EC2**:
   - Launch EC2 instance
   - Install Node.js
   - Deploy your code
   - Configure environment variables

2. **Host Frontend on S3**:
   - Upload HTML files to S3
   - Enable static website hosting
   - Configure CORS

3. **Secure RDS**:
   - Keep RDS private
   - Allow access only from EC2 security group
   - Use VPC for network isolation

## 🛠️ Troubleshooting

### Database Connection Issues
- Verify RDS endpoint is correct
- Check security groups allow port 3306
- Ensure RDS instance is running
- Verify username/password

### Frontend Issues
- Check browser console for errors
- Verify API_ROOT in api.js
- Ensure backend is running on port 3000

### S3 Upload Issues
- Verify AWS credentials
- Check S3 bucket permissions
- Ensure CORS is configured

## 📞 Support

If you encounter issues:
1. Check the console logs
2. Verify all environment variables
3. Test database connection first
4. Check AWS service status
