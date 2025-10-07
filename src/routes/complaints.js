const express = require('express');
const mysql = require('mysql2/promise');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

const dbPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
});

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.S3_BUCKET;

router.get('/upload-url', async (req, res) => {
	try {
		const rawName = String(req.query.filename || 'upload.bin');
		const filename = rawName.replace(/[^\w.\-]/g, '_');
		const key = `complaints/${Date.now()}-${filename}`;
		const cmd = new PutObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
			ContentType: req.query.contentType || 'application/octet-stream',
			ACL: 'private',
		});
		const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });
		res.json({ url, key });
	} catch (err) {
		res.status(500).json({ error: 'Failed to create upload URL' });
	}
});

router.post('/', async (req, res) => {
	const { user_id, area, description, s3_key } = req.body || {};
	if (!user_id || !area || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		const [result] = await dbPool.execute(
			'INSERT INTO complaints (user_id, area, description, s3_image_key) VALUES (?,?,?,?)',
			[user_id, area, description, s3_key || null]
		);
		res.json({ success: true, complaintId: result.insertId });
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

router.get('/', async (req, res) => {
	const page = Math.max(1, parseInt(req.query.page || '1', 10));
	const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10)));
	const offset = (page - 1) * pageSize;
	try {
		const [rows] = await dbPool.query(
			'SELECT * FROM complaints ORDER BY created_at DESC LIMIT ? OFFSET ?',
			[pageSize, offset]
		);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


