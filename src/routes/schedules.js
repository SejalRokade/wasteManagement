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

// Search schedules by area and/or day_of_week
router.get('/', async (req, res) => {
	const { area, day } = req.query;
	const clauses = [];
	const params = [];
	if (area) { clauses.push('area LIKE ?'); params.push(`%${area}%`); }
	if (day) { clauses.push('day_of_week = ?'); params.push(day); }
	const where = clauses.length ? ('WHERE ' + clauses.join(' AND ')) : '';
	try {
		const [rows] = await dbPool.query(`SELECT * FROM schedules ${where} ORDER BY area, day_of_week` , params);
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


