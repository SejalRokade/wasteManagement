const express = require('express');
const SQLiteDatabase = require('../database/sqlite');

const router = express.Router();

const db = new SQLiteDatabase();

router.get('/', async (_req, res) => {
	try {
		await db.connect();
		const [users] = await db.query('SELECT COUNT(*) AS cnt_users FROM users');
		const [complaints] = await db.query('SELECT COUNT(*) AS cnt_complaints FROM complaints');
		const [open] = await db.query("SELECT COUNT(*) AS cnt_open FROM complaints WHERE status = 'open'");
		const [bins] = await db.query('SELECT COUNT(*) AS cnt_bins FROM bins');
		const [ratings] = await db.query('SELECT COALESCE(AVG(rating),0) AS avg_rating FROM ratings');
		
		const cnt_users = users[0].cnt_users;
		const cnt_complaints = complaints[0].cnt_complaints;
		const cnt_open = open[0].cnt_open;
		const cnt_bins = bins[0].cnt_bins;
		const avg_rating = ratings[0].avg_rating;
		
		res.json({ users: cnt_users, complaints: cnt_complaints, openComplaints: cnt_open, bins: cnt_bins, avgRating: Number(avg_rating).toFixed(2) });
	} catch (err) {
		console.error('Stats error:', err);
		res.status(500).json({ error: 'DB error' });
	}
});

module.exports = router;


