"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = __importDefault(require("../config/db"));
const auth_1 = require("../middleware/auth");
const membership_1 = require("../middleware/membership");
const router = (0, express_1.Router)();
// 모든 라우트에 토큰 인증 및 멤버십 인증 적용
router.use(auth_1.authenticateToken, membership_1.authenticateMembership);
router.get('/', async (req, res) => {
    try {
        const [contents] = await db_1.default.execute('SELECT id, title, content, category, created_at FROM research_content ORDER BY created_at DESC');
        res.json(contents);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: '콘텐츠를 불러오는데 실패했습니다.' });
    }
});
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [contents] = await db_1.default.execute('SELECT * FROM research_content WHERE id = ?', [id]);
        if (contents.length === 0) {
            return res.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });
        }
        res.json(contents[0]);
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ message: '콘텐츠를 불러오는데 실패했습니다.' });
    }
});
exports.default = router;
