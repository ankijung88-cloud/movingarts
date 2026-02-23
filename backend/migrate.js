const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

async function migrate() {
    let pool;
    try {
        console.log('Connecting to database...');
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD === 'your_password' ? 'admin123!' : (process.env.DB_PASSWORD || 'admin123!'),
            database: process.env.DB_NAME || 'movingarts_db',
            waitForConnections: true,
            connectionLimit: 1,
            queueLimit: 0
        });

        const [rows] = await pool.execute(
            'SELECT COUNT(*) as count FROM research_content WHERE category = "시술분석"'
        );
        const count = rows[0].count;
        console.log(`Found ${count} items with '시술분석' category.`);

        if (count > 0) {
            await pool.execute(
                'UPDATE research_content SET category = "참고 영상" WHERE category = "시술분석"'
            );
            console.log("Successfully migrated '시술분석' to '참고 영상'.");
        } else {
            console.log("No migration needed.");
        }
    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        if (pool) await pool.end();
        process.exit(0);
    }
}
migrate();
