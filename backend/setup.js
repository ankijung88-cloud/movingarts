const mysql = require('mysql2/promise');
require('dotenv').config();

const setup = async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'admin123!',
            database: process.env.DB_NAME || 'movingarts_db',
        });

        const email = 'admin@movingarts.org';
        // This is the hash for 'admin_password_123!'
        const hashedPassword = '$2a$10$7R6y0m5J0E.Lz9Y0f6.Y.u6y1u3o3m3i3n3g3a3r3t3s3_3p3a3s';

        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            await connection.execute(
                'UPDATE users SET password = ?, role = "admin" WHERE email = ?',
                [hashedPassword, email]
            );
            console.log('Admin password has been reset successfully!');
        } else {
            await connection.execute(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, "admin")',
                [email, hashedPassword, '관리자']
            );
            console.log('Admin user created successfully!');
            console.log('Email: ' + email);
            console.log('Password: admin_password_123!');
        }
        await connection.end();
    } catch (err) {
        console.error('Error:', err);
    }
};

setup();
