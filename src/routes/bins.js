const express = require('express');
const DatabaseFactory = require('../database/database-factory');

const router = express.Router();

const db = DatabaseFactory.create();

router.get('/', async (req, res) => {
	try {
		await db.connect();
		const [rows] = await db.query('SELECT * FROM bins ORDER BY area');
		res.json(rows);
	} catch (err) {
		console.error('Bins error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

router.post('/:id/emptied', async (req, res) => {
	const { id } = req.params;
	try {
		await db.connect();
		await db.execute('UPDATE bins SET last_emptied = CURRENT_TIMESTAMP, current_level_percent = 0 WHERE id = ?', [id]);
		res.json({ success: true });
	} catch (err) {
		console.error('Bins update error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


