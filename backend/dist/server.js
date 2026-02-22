"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const paymentRoutes_1 = __importDefault(require("./routes/paymentRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
const db_1 = __importDefault(require("./config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
app.get('/api/init-admin', async (req, res) => {
    try {
        const email = 'admin@movingarts.org';
        const [rows] = await db_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            return res.json({ message: '이미 관리자 계정이 존재합니다.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash('admin_password_123!', 10);
        await db_1.default.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, "admin")', [email, hashedPassword, '관리자']);
        res.json({ message: '관리자 계정이 성공적으로 생성되었습니다!', email, password: 'admin_password_123!' });
    }
    catch (error) {
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
