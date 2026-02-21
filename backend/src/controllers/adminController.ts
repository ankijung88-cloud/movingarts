import { Request, Response } from 'express';
import pool from '../config/db';

export const getUsers = async (req: Request, res: Response) => {
    try {
        const [users] = await pool.execute('SELECT id, email, name, phone, role, created_at FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: '사용자 목록을 불러오는데 실패했습니다.' });
    }
};

export const getMemberships = async (req: Request, res: Response) => {
    try {
        const [memberships] = await pool.execute(`
            SELECT m.*, u.name as user_name, u.email as user_email 
            FROM memberships m 
            JOIN users u ON m.user_id = u.id
        `);
        res.json(memberships);
    } catch (err) {
        res.status(500).json({ message: '멤버십 목록을 불러오는데 실패했습니다.' });
    }
};

export const createContent = async (req: any, res: Response) => {
    const { title, content, category } = req.body;
    try {
        await pool.execute(
            'INSERT INTO research_content (title, content, category, author_id) VALUES (?, ?, ?, ?)',
            [title, content, category, req.user.id]
        );
        res.status(201).json({ message: '콘텐츠가 성공적으로 등록되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: '콘텐츠 등록에 실패했습니다.' });
    }
};

export const getContents = async (req: Request, res: Response) => {
    try {
        const [contents] = await pool.execute('SELECT * FROM research_content ORDER BY created_at DESC');
        res.json(contents);
    } catch (err) {
        res.status(500).json({ message: '콘텐츠 목록을 불러오는데 실패했습니다.' });
    }
};

export const updateContent = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    try {
        await pool.execute(
            'UPDATE research_content SET title = ?, content = ?, category = ? WHERE id = ?',
            [title, content, category, id]
        );
        res.json({ message: '콘텐츠가 수정되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: '콘텐츠 수정에 실패했습니다.' });
    }
};

export const deleteContent = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        await pool.execute('DELETE FROM research_content WHERE id = ?', [id]);
        res.json({ message: '콘텐츠가 삭제되었습니다.' });
    } catch (err) {
        res.status(500).json({ message: '콘텐츠 삭제에 실패했습니다.' });
    }
};
