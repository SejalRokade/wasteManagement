const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class SQLiteDatabase {
    constructor() {
        this.dbPath = process.env.DB_PATH || './waste-management.db';
        this.db = null;
    }

    async connect() {
        return new Promise((resolve, reject) => {
            this.db = new sqlite3.Database(this.dbPath, (err) => {
                if (err) {
                    console.error('❌ SQLite connection error:', err.message);
                    reject(err);
                } else {
                    console.log('✅ Connected to SQLite database');
                    resolve();
                }
            });
        });
    }

    async execute(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, function(err) {
                if (err) {
                    reject(err);
                } else {
                    resolve({ insertId: this.lastID, changes: this.changes });
                }
            });
        });
    }

    async query(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                } else {
                    resolve([rows]);
                }
            });
        });
    }

    async close() {
        return new Promise((resolve) => {
            if (this.db) {
                this.db.close(() => {
                    console.log('✅ SQLite connection closed');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

module.exports = SQLiteDatabase;
