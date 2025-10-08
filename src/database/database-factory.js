const MySQLDatabase = require('./mysql');
const SQLiteDatabase = require('./sqlite');

class DatabaseFactory {
    static create() {
        // Check if we're in development mode or if RDS is not accessible
        const useSQLite = process.env.USE_SQLITE === 'true' || process.env.NODE_ENV === 'development';
        
        if (useSQLite) {
            console.log('📱 Using SQLite database for local development');
            return new SQLiteDatabase();
        } else {
            console.log('☁️ Using MySQL database (RDS)');
            return new MySQLDatabase();
        }
    }
}

module.exports = DatabaseFactory;
