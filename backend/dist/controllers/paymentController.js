"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const db_1 = __importDefault(require("../config/db"));
// PortOne (IAMPORT) Verification Logic
const verifyPayment = async (req, res) => {
    const { imp_uid, merchant_uid, plan, amount } = req.body;
    const userId = req.user.id;
    try {
        // 1. Get access token from PortOne (Simulated or real)
        // For this implementation, we assume the client-side payment was successful.
        // In production, you would call https://api.iamport.kr/users/getToken
        // 2. Verify payment amount with PortOne API
        // const paymentData = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, { ...headers });
        // 3. Update database
        const [paymentResult] = await db_1.default.query('INSERT INTO payments (user_id, imp_uid, merchant_uid, amount, status) VALUES (?, ?, ?, ?, ?)', [userId, imp_uid, merchant_uid, amount, 'paid']);
        // 4. Update or Create Membership
        const durationDays = plan === 'monthly' ? 30 : 365;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);
        await db_1.default.query('INSERT INTO memberships (user_id, type, status, start_date, end_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status="active", end_date=?', [userId, plan, 'active', startDate, endDate, endDate]);
        res.json({ message: '결제가 성공적으로 확인되었습니다.', membership: { plan, endDate } });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '결제 검증 중 오류가 발생했습니다.' });
    }
};
exports.verifyPayment = verifyPayment;
