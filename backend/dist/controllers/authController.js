"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMembershipStatus = exports.submitMembershipRequest = exports.resetPasswordRequest = exports.findEmail = exports.getProfile = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const JWT_SECRET = process.env.JWT_SECRET || 'premium_secret_key_123';
const register = async (req, res) => {
    const { email, password, name, phone } = req.body;
    try {
        const [existing] = await db_1.default.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 가입된 이메일입니다.' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const [result] = await db_1.default.query('INSERT INTO users (email, password, name, phone) VALUES (?, ?, ?, ?)', [email, hashedPassword, name, phone]);
        res.status(201).json({ message: '회원가입이 완료되었습니다.', userId: result.insertId });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db_1.default.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: '이메일 또는 비밀번호가 일치하지 않습니다.' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, {
            expiresIn: '7d',
        });
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.login = login;
const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [users] = await db_1.default.query('SELECT id, email, name, phone, role, created_at FROM users WHERE id = ?', [userId]);
        if (users.length === 0) {
            return res.status(404).json({ message: '사용자를 찾을 수 없습니다.' });
        }
        // Get active membership if exists
        const [memberships] = await db_1.default.query('SELECT * FROM memberships WHERE user_id = ? AND status = "active" AND end_date >= CURDATE() ORDER BY end_date DESC LIMIT 1', [userId]);
        res.json({
            user: users[0],
            membership: memberships[0] || null
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.getProfile = getProfile;
const findEmail = async (req, res) => {
    const { name, phone } = req.body;
    try {
        const [users] = await db_1.default.query('SELECT email FROM users WHERE name = ? AND phone = ?', [name, phone]);
        if (users.length === 0) {
            return res.status(404).json({ message: '해당 정보와 일치하는 사용자를 찾을 수 없습니다.' });
        }
        const email = users[0].email;
        const [userPart, domainPart] = email.split('@');
        const maskedUser = userPart.length > 3
            ? userPart.substring(0, 3) + '*'.repeat(userPart.length - 3)
            : userPart.substring(0, 1) + '*'.repeat(userPart.length - 1);
        const maskedEmail = `${maskedUser}@${domainPart}`;
        res.json({ email: maskedEmail });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.findEmail = findEmail;
const resetPasswordRequest = async (req, res) => {
    const { email, name } = req.body;
    try {
        const [users] = await db_1.default.query('SELECT id FROM users WHERE email = ? AND name = ?', [email, name]);
        if (users.length === 0) {
            return res.status(404).json({ message: '해당 정보와 일치하는 사용자를 찾을 수 없습니다.' });
        }
        // In a real app, you would send a reset link via email here.
        // For now, we return success to allow the frontend to proceed or simulate the process.
        res.json({ message: '계정 확인이 완료되었습니다. 비밀번호 재설정이 가능합니다.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '서버 오류가 발생했습니다.' });
    }
};
exports.resetPasswordRequest = resetPasswordRequest;
const submitMembershipRequest = async (req, res) => {
    const userId = req.user.id;
    const { requestDetails } = req.body;
    try {
        // Check if there's already a pending request
        const [existing] = await db_1.default.query('SELECT id FROM membership_requests WHERE user_id = ? AND status = "pending"', [userId]);
        if (existing.length > 0) {
            return res.status(400).json({ message: '이미 대기 중인 승인 요청이 있습니다.' });
        }
        await db_1.default.query('INSERT INTO membership_requests (user_id, request_details) VALUES (?, ?)', [userId, requestDetails || 'Normal membership request']);
        res.status(201).json({ message: '멤버십 승인 요청이 전송되었습니다.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '데이터처리 중 오류가 발생했습니다.' });
    }
};
exports.submitMembershipRequest = submitMembershipRequest;
const getMembershipStatus = async (req, res) => {
    const userId = req.user.id;
    try {
        const [requests] = await db_1.default.query('SELECT * FROM membership_requests WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId]);
        res.json(requests[0] || null);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: '상태 정보를 불러오는데 실패했습니다.' });
    }
};
exports.getMembershipStatus = getMembershipStatus;
