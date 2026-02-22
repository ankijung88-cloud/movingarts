const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
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
        const hashedPassword = await bcrypt.hash('admin_password_123!', 10);

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
