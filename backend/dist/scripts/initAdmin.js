"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const createAdmin = async () => {
    const connection = await promise_1.default.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });
    const email = 'admin@movingarts.org';
    const password = 'admin_password_123!'; // User should change this later
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const name = '관리자';
    const role = 'admin';
    try {
        const [rows] = await connection.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Admin user already exists.');
        }
        else {
            await connection.execute('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hashedPassword, name, role]);
            console.log('Admin user created successfully.');
            console.log('Email: ' + email);
            console.log('Password: ' + password);
        }
    }
    catch (err) {
        console.error('Error creating admin:', err);
    }
    finally {
        await connection.end();
    }
};
createAdmin();
