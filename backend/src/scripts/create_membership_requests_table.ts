import pool from '../config/db';

async function migrate() {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS membership_requests (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
            request_details TEXT,
            admin_comment TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        );
    `;

    try {
        console.log('Creating membership_requests table...');
        await pool.execute(createTableQuery);
        console.log('Success: Table membership_requests created or already exists.');
        await pool.end();
    } catch (err) {
        console.error('Error migrating database:', err);
        process.exit(1);
    }
}

migrate();
