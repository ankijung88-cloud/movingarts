const mysql = require('mysql2/promise');
require('dotenv').config();

async function verify() {
    let connection;
    try {
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD === 'your_password' ? 'admin123!' : (process.env.DB_PASSWORD || 'admin123!'),
            database: process.env.DB_NAME || 'movingarts_db'
        });

        const [rows] = await connection.execute('SELECT * FROM research_content LIMIT 1');
        console.log('Sample Record:', JSON.stringify(rows[0], null, 2));

        const [counts] = await connection.execute('SELECT category, count(*) as count FROM research_content GROUP BY category');
        console.log('Category Counts:', JSON.stringify(counts, null, 2));

    } catch (err) {
        console.error('Verification failed:', err.message);
    } finally {
        if (connection) await connection.end();
        process.exit(0);
    }
}
verify();
