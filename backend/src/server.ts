import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import paymentRoutes from './routes/paymentRoutes';
import adminRoutes from './routes/adminRoutes';
import contentRoutes from './routes/contentRoutes';
import * as translateController from './controllers/translateController';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/contents', contentRoutes);
app.post('/api/translate', translateController.translateText);

import pool from './config/db';
import bcrypt from 'bcryptjs';

app.get('/api/init-admin', async (req, res) => {
    try {
        const email = 'admin@movingarts.org';
        const [rows]: any = await pool.query('SELECT id FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            return res.json({ message: '이미 관리자 계정이 존재합니다.' });
        }

        const hashedPassword = await bcrypt.hash('admin_password_123!', 10);
        await pool.query(
            'INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, "admin")',
            [email, hashedPassword, '관리자']
        );

        res.json({ message: '관리자 계정이 성공적으로 생성되었습니다!', email, password: 'admin_password_123!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: '관리자 생성 중 오류 발생' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'MovingArts Backend is running' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
