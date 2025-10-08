# 🔧 RDS Connection Troubleshooting Guide

## ❌ Current Issue: `connect ETIMEDOUT`

Your RDS database is not accessible from your current location. Here's how to fix it:

## 🛠️ **Step 1: Check RDS Security Groups**

### **In AWS Console:**
1. **Go to RDS** → **Databases** → **waste-management**
2. **Click "Connectivity & security" tab**
3. **Find "VPC security groups"** (e.g., `rds-launch-wizard-1`)
4. **Click on the security group link**

### **Edit Security Group Rules:**
1. **Click "Edit inbound rules"**
2. **Add new rule:**
   - **Type**: MySQL/Aurora
   - **Port**: 3306
   - **Source**: `0.0.0.0/0` (for testing)
   - **Description**: "Allow MySQL access from anywhere"
3. **Save rules**

## 🛠️ **Step 2: Verify RDS Configuration**

### **Check RDS Settings:**
1. **Go to RDS** → **Databases** → **waste-management**
2. **Verify:**
   - ✅ **Status**: Available
   - ✅ **Publicly accessible**: Yes
   - ✅ **VPC**: Should be in a public subnet
   - ✅ **Endpoint**: `waste-management.cxq662oseum3.eu-north-1.rds.amazonaws.com`

## 🛠️ **Step 3: Test Connection Methods**

### **Option A: Test from AWS EC2 (Recommended)**
If you have an EC2 instance in the same VPC:
```bash
# On EC2 instance
mysql -h waste-management.cxq662oseum3.eu-north-1.rds.amazonaws.com -u admin -p
```

### **Option B: Test from Local Machine**
```bash
# Install MySQL client locally
# Windows: Download MySQL Workbench or use WSL
# Then test:
mysql -h waste-management.cxq662oseum3.eu-north-1.rds.amazonaws.com -u admin -p
```

## 🛠️ **Step 4: Alternative - Use Local Database for Testing**

If RDS connection continues to fail, you can test with a local MySQL database:

### **Install MySQL locally:**
```bash
# Windows: Download MySQL Community Server
# Or use Docker:
docker run --name mysql-local -e MYSQL_ROOT_PASSWORD=password -e MYSQL_DATABASE=waste-management -p 3306:3306 -d mysql:8.0
```

### **Update config.env for local testing:**
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=waste-management
```

## 🚀 **Step 5: Test Backend Without Database**

Let's test if the backend server starts correctly:

```bash
# Start the server (it will show connection error but still start)
npm start
```

## 📞 **Quick Fixes to Try:**

1. **Wait 5-10 minutes** after updating security groups
2. **Check if RDS is in a private subnet** (needs NAT Gateway)
3. **Try connecting from AWS CloudShell** (free browser-based terminal)
4. **Use RDS Proxy** for better connection management

## 🎯 **Expected Results:**

Once fixed, you should see:
```
✅ Successfully connected to RDS database!
📊 Database stats:
   Users: 0
   Complaints: 0
   Bins: 0
```

## 🔄 **Next Steps After Fix:**

1. **Test database connection**: `node test-db-connection.js`
2. **Start backend server**: `npm start`
3. **Test frontend**: Open `http://localhost` (port 80)
4. **Test full integration**: Sign up, login, submit complaint
