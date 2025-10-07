const express = require('express');
const mysql = require('mysql2/promise');

const router = express.Router();

const dbPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
});

router.get('/', async (_req, res) => {
	try {
		const [[{ cnt_users }]] = await dbPool.query('SELECT COUNT(*) AS cnt_users FROM users');
		const [[{ cnt_complaints }]] = await dbPool.query('SELECT COUNT(*) AS cnt_complaints FROM complaints');
		const [[{ cnt_open }]] = await dbPool.query("SELECT COUNT(*) AS cnt_open FROM complaints WHERE status = 'open'");
		const [[{ cnt_bins }]] = await dbPool.query('SELECT COUNT(*) AS cnt_bins FROM bins');
		const [[{ avg_rating }]] = await dbPool.query('SELECT COALESCE(AVG(rating),0) AS avg_rating FROM ratings');
		res.json({ users: cnt_users, complaints: cnt_complaints, openComplaints: cnt_open, bins: cnt_bins, avgRating: Number(avg_rating).toFixed(2) });
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


