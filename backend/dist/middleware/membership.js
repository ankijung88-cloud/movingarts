"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateMembership = void 0;
const db_1 = __importDefault(require("../config/db"));
const authenticateMembership = async (req, res, next) => {
    const userId = req.user?.id;
    if (!userId) {
        return res.status(401).json({ message: '인증이 필요합니다.' });
    }
    try {
        // 관리자는 모든 콘텐츠 접근 가능
        if (req.user?.role === 'admin') {
            return next();
        }
        const [memberships] = await db_1.default.query('SELECT * FROM memberships WHERE user_id = ? AND status = "active" AND end_date >= CURDATE()', [userId]);
        if (memberships.length === 0) {
            return res.status(403).json({
                message: '유효한 구독 멤버십이 필요합니다.',
                requireMembership: true
            });
        }
        next();
    }
    catch (error) {
        console.error('Membership verification error:', error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.authenticateMembership = authenticateMembership;
