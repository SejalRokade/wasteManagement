# Waste Management App

Backend: Node.js/Express + MySQL (RDS) + AWS S3 presigned uploads.
Frontend: Static HTML/JS in `public/`.

## Prerequisites
- Node.js 18+
- MySQL (Amazon RDS recommended)
- S3 bucket and an EC2 instance profile with S3 PutObject permissions

## Setup
```bash
npm install
npm run dev   # or: npm start
```

Create `.env` with:
```
PORT=3000
CORS_ORIGIN=https://your-frontend.example.com
DB_HOST=your-rds-endpoint.rds.amazonaws.com
DB_USER=app_user
DB_PASSWORD=strong_password
DB_NAME=wastemanagement
AWS_REGION=ap-south-1
S3_BUCKET=your-upload-bucket
```

Apply schema from `schema.sql` in your DB.

## API
- GET `/api/complaints/upload-url?filename=name.jpg&contentType=image/jpeg`
- POST `/api/complaints` { user_id, area, description, s3_key? }
- GET `/api/complaints?page=1&pageSize=20`

## Frontend
Open `public/index.html` or host on S3/CloudFront. Configure `API_BASE` if needed.

## Deployment (optional)
- Nginx reverse proxy: `deploy/nginx.conf`
- systemd unit: `deploy/wm-api.service`
- S3 CORS: `config/s3-cors.json`
- EC2 IAM policy: `config/iam-policy.json`
