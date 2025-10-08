const express = require('express');
const SQLiteDatabase = require('../database/sqlite');

const router = express.Router();

const db = new SQLiteDatabase();

// Search schedules by area and/or day_of_week
router.get('/', async (req, res) => {
	const { area, day } = req.query;
	const clauses = [];
	const params = [];
	if (area) { clauses.push('area LIKE ?'); params.push(`%${area}%`); }
	if (day) { clauses.push('day_of_week = ?'); params.push(day); }
	const where = clauses.length ? ('WHERE ' + clauses.join(' AND ')) : '';
	try {
		await db.connect();
		const [rows] = await db.query(`SELECT * FROM schedules ${where} ORDER BY area, day_of_week` , params);
		res.json(rows);
	} catch (err) {
		console.error('Schedules error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


