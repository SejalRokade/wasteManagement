require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDatabaseName() {
    console.log('🔍 Testing database connection without specifying database...');
    
    try {
        // Try connecting without database name first
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 3306,
            connectTimeout: 10000
        });
        
        console.log('✅ Connected successfully!');
        
        // List all databases
        const [databases] = await connection.execute('SHOW DATABASES');
        console.log('📊 Available databases:');
        databases.forEach(db => {
            console.log(`  - ${db.Database}`);
        });
        
        await connection.end();
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    }
}

testDatabaseName();
