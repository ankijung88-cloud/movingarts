"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContent = exports.updateContent = exports.getContents = exports.createContent = exports.getMemberships = exports.getUsers = void 0;
const db_1 = __importDefault(require("../config/db"));
const getUsers = async (req, res) => {
    try {
        const [users] = await db_1.default.execute('SELECT id, email, name, phone, role, created_at FROM users');
        res.json(users);
    }
    catch (err) {
        res.status(500).json({ message: '사용자 목록을 불러오는데 실패했습니다.' });
    }
};
exports.getUsers = getUsers;
const getMemberships = async (req, res) => {
    try {
        const [memberships] = await db_1.default.execute(`
            SELECT m.*, u.name as user_name, u.email as user_email 
            FROM memberships m 
            JOIN users u ON m.user_id = u.id
        `);
        res.json(memberships);
    }
    catch (err) {
        res.status(500).json({ message: '멤버십 목록을 불러오는데 실패했습니다.' });
    }
};
exports.getMemberships = getMemberships;
const createContent = async (req, res) => {
    const { title, content, category } = req.body;
    try {
        await db_1.default.execute('INSERT INTO research_content (title, content, category, author_id) VALUES (?, ?, ?, ?)', [title, content, category, req.user.id]);
        res.status(201).json({ message: '콘텐츠가 성공적으로 등록되었습니다.' });
    }
    catch (err) {
        res.status(500).json({ message: '콘텐츠 등록에 실패했습니다.' });
    }
};
exports.createContent = createContent;
const getContents = async (req, res) => {
    try {
        const [contents] = await db_1.default.execute('SELECT * FROM research_content ORDER BY created_at DESC');
        res.json(contents);
    }
    catch (err) {
        res.status(500).json({ message: '콘텐츠 목록을 불러오는데 실패했습니다.' });
    }
};
exports.getContents = getContents;
const updateContent = async (req, res) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    try {
        await db_1.default.execute('UPDATE research_content SET title = ?, content = ?, category = ? WHERE id = ?', [title, content, category, id]);
        res.json({ message: '콘텐츠가 수정되었습니다.' });
    }
    catch (err) {
        res.status(500).json({ message: '콘텐츠 수정에 실패했습니다.' });
    }
};
exports.updateContent = updateContent;
const deleteContent = async (req, res) => {
    const { id } = req.params;
    try {
        await db_1.default.execute('DELETE FROM research_content WHERE id = ?', [id]);
        res.json({ message: '콘텐츠가 삭제되었습니다.' });
    }
    catch (err) {
        res.status(500).json({ message: '콘텐츠 삭제에 실패했습니다.' });
    }
};
exports.deleteContent = deleteContent;
