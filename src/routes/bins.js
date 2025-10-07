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

router.get('/', async (req, res) => {
	try {
		const [rows] = await dbPool.query('SELECT * FROM bins ORDER BY area');
		res.json(rows);
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

router.post('/:id/emptied', async (req, res) => {
	const { id } = req.params;
	try {
		await dbPool.execute('UPDATE bins SET last_emptied = CURRENT_TIMESTAMP, current_level_percent = 0 WHERE id = ?', [id]);
		res.json({ success: true });
	} catch (err) {
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


