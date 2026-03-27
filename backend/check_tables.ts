import pool from './src/config/db';

async function checkTables() {
    console.log('Connecting to database at:', process.env.DB_HOST);
    try {
        const connection = await pool.getConnection();
        console.log('Successfully connected to database!');
        const [rows] = await connection.execute('SHOW TABLES');
        console.log('Tables in movingarts_db:', rows);
        connection.release();
        await pool.end();
    } catch (err: any) {
        console.error('Error connecting to database:');
        console.error('Code:', err.code);
        console.error('Errno:', err.errno);
        console.error('Message:', err.message);
        process.exit(1);
    }
}

checkTables();
