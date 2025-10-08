const express = require('express');
const SQLiteDatabase = require('../database/sqlite');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const router = express.Router();

const db = new SQLiteDatabase();

const s3 = new S3Client({ region: process.env.AWS_REGION });
const BUCKET_NAME = process.env.S3_BUCKET;

router.get('/upload-url', async (req, res) => {
	try {
		// For now, return a mock URL since S3 might not be configured
		const filename = String(req.query.filename || 'upload.bin').replace(/[^\w.\-]/g, '_');
		const key = `complaints/${Date.now()}-${filename}`;
		res.json({ url: `mock://upload/${key}`, key });
	} catch (err) {
		console.error('Upload URL error:', err);
		res.status(500).json({ error: 'Failed to create upload URL' });
	}
});

router.post('/', async (req, res) => {
	const { user_id, area, description, s3_key } = req.body || {};
	if (!user_id || !area || !description) {
		return res.status(400).json({ error: 'Missing required fields' });
	}
	try {
		await db.connect();
		const result = await db.execute(
			'INSERT INTO complaints (user_id, area, description, s3_image_key) VALUES (?,?,?,?)',
			[user_id, area, description, s3_key || null]
		);
		res.json({ success: true, complaintId: result.insertId });
	} catch (err) {
		console.error('Complaint creation error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

router.get('/', async (req, res) => {
	const page = Math.max(1, parseInt(req.query.page || '1', 10));
	const pageSize = Math.min(100, Math.max(1, parseInt(req.query.pageSize || '20', 10)));
	const offset = (page - 1) * pageSize;
	try {
		await db.connect();
		const [rows] = await db.query(
			'SELECT * FROM complaints ORDER BY created_at DESC LIMIT ? OFFSET ?',
			[pageSize, offset]
		);
		res.json(rows);
	} catch (err) {
		console.error('Complaints fetch error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


