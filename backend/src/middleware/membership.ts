import { Request, Response, NextFunction } from 'express';
import pool from '../config/db';

export const authenticateMembership = async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req as any).user?.id;

    if (!userId) {
        return res.status(401).json({ message: '인증이 필요합니다.' });
    }

    try {
        // 관리자는 모든 콘텐츠 접근 가능
        if ((req as any).user?.role === 'admin') {
            return next();
        }

        const [memberships] = await pool.query(
            'SELECT * FROM memberships WHERE user_id = ? AND status = "active" AND end_date >= CURDATE()',
            [userId]
        ) as any[];

        if (memberships.length === 0) {
            return res.status(403).json({
                message: '유효한 구독 멤버십이 필요합니다.',
                requireMembership: true
            });
        }

        next();
    } catch (error) {
        console.error('Membership verification error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
