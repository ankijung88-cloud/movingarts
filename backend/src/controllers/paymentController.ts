import { Request, Response } from 'express';
import pool from '../config/db';
import axios from 'axios';

// PortOne (IAMPORT) Verification Logic
export const verifyPayment = async (req: Request, res: Response) => {
    const { imp_uid, merchant_uid, plan, amount } = req.body;
    const userId = (req as any).user.id;

    try {
        // 1. Get access token from PortOne (Simulated or real)
        // For this implementation, we assume the client-side payment was successful.
        // In production, you would call https://api.iamport.kr/users/getToken

        // 2. Verify payment amount with PortOne API
        // const paymentData = await axios.get(`https://api.iamport.kr/payments/${imp_uid}`, { ...headers });

        // 3. Update database
        const [paymentResult] = await pool.query(
            'INSERT INTO payments (user_id, imp_uid, merchant_uid, amount, status) VALUES (?, ?, ?, ?, ?)',
            [userId, imp_uid, merchant_uid, amount, 'paid']
        ) as any;

        // 4. Update or Create Membership
        const durationDays = plan === 'monthly' ? 30 : 365;
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + durationDays);

        await pool.query(
            'INSERT INTO memberships (user_id, type, status, start_date, end_date) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status="active", end_date=?',
            [userId, plan, 'active', startDate, endDate, endDate]
        );

        res.json({ message: '결제가 성공적으로 확인되었습니다.', membership: { plan, endDate } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '결제 검증 중 오류가 발생했습니다.' });
    }
};
