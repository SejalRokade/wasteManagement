require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const complaintsRouter = require('./src/routes/complaints');
const authRouter = require('./src/routes/auth');
const schedulesRouter = require('./src/routes/schedules');
const ratingsRouter = require('./src/routes/ratings');
const binsRouter = require('./src/routes/bins');
const statsRouter = require('./src/routes/stats');
const path = require('path');

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: false }));
app.use(helmet());
app.use(express.json({ limit: '5mb' }));

app.use('/api', rateLimit({ windowMs: 60_000, max: 300 }));
app.use('/api/complaints', complaintsRouter);
app.use('/api/auth', authRouter);
app.use('/api/schedules', schedulesRouter);
app.use('/api/ratings', ratingsRouter);
app.use('/api/bins', binsRouter);
app.use('/api/stats', statsRouter);

// Static hosting (optional)
app.use(express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => {
	console.log(`Server running on port ${port}`);
});


