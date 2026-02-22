import pool from './src/config/db';

async function checkTables() {
    try {
        const [rows] = await pool.execute('SHOW TABLES');
        console.log('Tables in movingarts_db:', rows);
        await pool.end();
    } catch (err) {
        console.error('Error checking tables:', err);
        process.exit(1);
    }
}

checkTables();
