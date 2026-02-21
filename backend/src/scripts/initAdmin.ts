import bcrypt from 'bcryptjs';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

const createAdmin = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    const email = 'admin@movingarts.org';
    const password = 'admin_password_123!'; // User should change this later
    const hashedPassword = await bcrypt.hash(password, 10);
    const name = '관리자';
    const role = 'admin';

    try {
        const [rows]: any = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Admin user already exists.');
        } else {
            await connection.execute(
                'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, name, role]
            );
            console.log('Admin user created successfully.');
            console.log('Email: ' + email);
            console.log('Password: ' + password);
        }
    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await connection.end();
    }
};

createAdmin();
