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

router.post('/', async (req, res) => {
	const { user_id, area, rating, comment } = req.body || {};
	if (!user_id || !area || !rating) return res.status(400).json({ error: 'Missing fields' });
	if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
	try {
		const [result] = await dbPool.execute(
			'INSERT INTO ratings (user_id, area, rating, comment) VALUES (?,?,?,?)',
			[user_id, area, rating, comment || null]
		);
		res.json({ success: true, id: result.insertId });
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

router.get('/', async (req, res) => {
	const { area } = req.query;
	try {
		const [rows] = area
			? await dbPool.execute('SELECT * FROM ratings WHERE area = ? ORDER BY created_at DESC', [area])
			: await dbPool.query('SELECT * FROM ratings ORDER BY created_at DESC');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


