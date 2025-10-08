const express = require('express');
const SQLiteDatabase = require('../database/sqlite');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const router = express.Router();

const db = new SQLiteDatabase();

const signupSchema = z.object({
	name: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	password: z.string().min(6),
});

router.post('/signup', async (req, res) => {
	try {
		const { name, email, phone, password } = signupSchema.parse(req.body || {});
		const password_hash = await bcrypt.hash(password, 10);
		await db.connect();
		const result = await db.execute(
			'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?,?,?,?,?)',
			[name, email, phone || null, password_hash, 'citizen']
		);
		res.json({ success: true, userId: result.insertId });
	} catch (err) {
		if (err.message.includes('UNIQUE constraint failed')) return res.status(400).json({ error: 'Email already exists' });
		console.error('Signup error:', err);
		res.status(400).json({ error: 'Invalid input' });
	}
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
	try {
		const { email, password } = loginSchema.parse(req.body || {});
		await db.connect();
		const [rows] = await db.query('SELECT id, password_hash, role, name FROM users WHERE email = ?', [email]);
		if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
		const user = rows[0];
		const ok = await bcrypt.compare(password, user.password_hash || '');
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = jwt.sign({ sub: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
		res.json({ token });
	} catch (err) {
		console.error('Login error:', err);
		res.status(400).json({ error: 'Invalid input' });
	}
});

module.exports = router;


