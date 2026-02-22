import pool from './src/config/db';

async function migrate() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS research_content (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            content TEXT NOT NULL,
            category VARCHAR(100),
            author_id INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    try {
        console.log('Creating research_content table...');
        await pool.execute(createTableQuery);
        console.log('Success: Table research_content created or already exists.');
        await pool.end();
    } catch (err) {
        console.error('Error migrating database:', err);
        process.exit(1);
    }
}

migrate();
