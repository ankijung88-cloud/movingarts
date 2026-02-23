import pool from './src/config/db';

async function migrate() {
    try {
        const [rows]: any = await pool.execute(
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
        await pool.end();
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}
migrate();
