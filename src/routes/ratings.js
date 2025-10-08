const express = require('express');
const SQLiteDatabase = require('../database/sqlite');

const router = express.Router();

const db = new SQLiteDatabase();

router.post('/', async (req, res) => {
	const { user_id, area, rating, comment } = req.body || {};
	if (!user_id || !area || !rating) return res.status(400).json({ error: 'Missing fields' });
	if (rating < 1 || rating > 5) return res.status(400).json({ error: 'Invalid rating' });
	try {
		await db.connect();
		const result = await db.execute(
			'INSERT INTO ratings (user_id, area, rating, comment) VALUES (?,?,?,?)',
			[user_id, area, rating, comment || null]
		);
		res.json({ success: true, id: result.insertId });
	} catch (err) {
		console.error('Rating creation error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

router.get('/', async (req, res) => {
	const { area } = req.query;
	try {
		await db.connect();
		const [rows] = area
			? await db.query('SELECT * FROM ratings WHERE area = ? ORDER BY created_at DESC', [area])
			: await db.query('SELECT * FROM ratings ORDER BY created_at DESC');
		res.json(rows);
	} catch (err) {
		console.error('Ratings fetch error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


