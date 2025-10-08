require('dotenv').config({ path: './config.env' });
const MySQLDatabase = require('./src/database/mysql');

async function testMySQLConnection() {
    console.log('🔍 Testing MySQL database connection...');
    console.log('📋 Configuration:');
    console.log(`   Host: ${process.env.DB_HOST}`);
    console.log(`   User: ${process.env.DB_USER}`);
    console.log(`   Database: ${process.env.DB_NAME}`);
    console.log(`   Port: ${process.env.DB_PORT || 3306}`);
    
    const db = new MySQLDatabase();
    
    try {
        await db.connect();
        console.log('✅ Successfully connected to MySQL database!');
        
        // Test basic query
        const [users] = await db.query('SELECT COUNT(*) AS user_count FROM users');
        const [complaints] = await db.query('SELECT COUNT(*) AS complaint_count FROM complaints');
        const [bins] = await db.query('SELECT COUNT(*) AS bin_count FROM bins');
        
        console.log('📊 Database stats:');
        console.log(`   Users: ${users[0].user_count}`);
        console.log(`   Complaints: ${complaints[0].complaint_count}`);
        console.log(`   Bins: ${bins[0].bin_count}`);
        
        await db.close();
        console.log('✅ Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.error('💡 Troubleshooting tips:');
        console.error('   1. Check if your RDS instance is running');
        console.error('   2. Verify security group allows connections from your IP');
        console.error('   3. Confirm database credentials are correct');
        console.error('   4. Ensure database exists and schema is applied');
    }
}

testMySQLConnection();
