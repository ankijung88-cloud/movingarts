import pool from './src/config/db';

async function check() {
    try {
        const [rows]: any = await pool.execute('SHOW TABLES');
        const tables = rows.map((row: any) => Object.values(row)[0]);
        console.log('Tables:', tables);
        if (tables.includes('research_content')) {
            console.log('Verification Success: research_content table exists.');
        } else {
            console.log('Verification Failed: research_content table NOT found.');
        }
        await pool.end();
    } catch (err) {
        console.error('Check failed:', err);
    }
}
check();
