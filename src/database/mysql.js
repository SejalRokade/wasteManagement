const mysql = require('mysql2/promise');

class MySQLDatabase {
    constructor() {
        this.connection = null;
        this.config = {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            port: process.env.DB_PORT || 3306,
            connectTimeout: 10000
        };
    }

    async connect() {
        try {
            this.connection = await mysql.createConnection(this.config);
            console.log('✅ Connected to MySQL database');
        } catch (err) {
            console.error('❌ MySQL connection error:', err.message);
            throw err;
        }
    }

    async execute(query, params = []) {
        if (!this.connection) {
            await this.connect();
        }
        
        try {
            const [result] = await this.connection.execute(query, params);
            return {
                insertId: result.insertId,
                changes: result.affectedRows
            };
        } catch (err) {
            console.error('❌ MySQL execute error:', err.message);
            throw err;
        }
    }

    async query(query, params = []) {
        if (!this.connection) {
            await this.connect();
        }
        
        try {
            const [rows] = await this.connection.execute(query, params);
            return [rows];
        } catch (err) {
            console.error('❌ MySQL query error:', err.message);
            throw err;
        }
    }

    async close() {
        if (this.connection) {
            await this.connection.end();
            console.log('✅ MySQL connection closed');
            this.connection = null;
        }
    }
}

module.exports = MySQLDatabase;
