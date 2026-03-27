"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const contentRoutes_1 = __importDefault(require("./routes/contentRoutes"));
const translateController = __importStar(require("./controllers/translateController"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/uploads', express_1.default.static('uploads'));
// Routes
app.use('/api/users', userRoutes_1.default);
app.use('/api/payments', paymentRoutes_1.default);
app.use('/api/admin', adminRoutes_1.default);
app.use('/api/contents', contentRoutes_1.default);
app.post('/api/translate', translateController.translateText);
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
// Global Error Handler
app.use((err, req, res, next) => {
    console.error('SERVER_ERROR:', err);
    // Handle Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: '파일 크기가 너무 큽니다. (최대 100MB)' });
    }
    res.status(err.status || 500).json({
        message: err.message || '서버 내부 오류가 발생했습니다.',
        error: process.env.NODE_ENV === 'development' ? err : {}
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
