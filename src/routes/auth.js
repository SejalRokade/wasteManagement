const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

const router = express.Router();

const dbPool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	waitForConnections: true,
	connectionLimit: 10,
});

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
		const [result] = await dbPool.execute(
			'INSERT INTO users (name, email, phone, password_hash, role) VALUES (?,?,?,?,?)',
			[name, email, phone || null, password_hash, 'citizen']
		);
		res.json({ success: true, userId: result.insertId });
	} catch (err) {
		if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: 'Email already exists' });
		res.status(400).json({ error: 'Invalid input' });
	}
});

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(6) });

router.post('/login', async (req, res) => {
	try {
		const { email, password } = loginSchema.parse(req.body || {});
		const [rows] = await dbPool.execute('SELECT id, password_hash, role, name FROM users WHERE email = ?', [email]);
		if (!rows.length) return res.status(401).json({ error: 'Invalid credentials' });
		const user = rows[0];
		const ok = await bcrypt.compare(password, user.password_hash || '');
		if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
		const token = jwt.sign({ sub: user.id, role: user.role, name: user.name }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' });
		res.json({ token });
	} catch (err) {
		res.status(400).json({ error: 'Invalid input' });
	}
});

module.exports = router;


