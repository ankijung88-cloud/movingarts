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
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const thumbnailUrl = files?.thumbnail?.[0] ? `/uploads/${files.thumbnail[0].filename}` : null;
    const videoUrl = files?.video?.[0] ? `/uploads/${files.video[0].filename}` : null;

    try {
        await pool.execute(
            'INSERT INTO research_content (title, content, category, thumbnail_url, video_url, author_id) VALUES (?, ?, ?, ?, ?, ?)',
            [title, content, category, thumbnailUrl, videoUrl, req.user.id]
        );
        res.status(201).json({ message: '콘텐츠가 성공적으로 등록되었습니다.' });
    } catch (err) {
        console.error(err);
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

export const updateContent = async (req: any, res: Response) => {
    const { id } = req.params;
    const { title, content, category } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    try {
        // Get existing content to preserve old files if new ones aren't uploaded
        const [rows]: any = await pool.execute('SELECT thumbnail_url, video_url FROM research_content WHERE id = ?', [id]);
        if (rows.length === 0) return res.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });

        const thumbnailUrl = files?.thumbnail?.[0] ? `/uploads/${files.thumbnail[0].filename}` : rows[0].thumbnail_url;
        const videoUrl = files?.video?.[0] ? `/uploads/${files.video[0].filename}` : rows[0].video_url;

        await pool.execute(
            'UPDATE research_content SET title = ?, content = ?, category = ?, thumbnail_url = ?, video_url = ? WHERE id = ?',
            [title, content, category, thumbnailUrl, videoUrl, id]
        );
        res.json({ message: '콘텐츠가 수정되었습니다.' });
    } catch (err) {
        console.error(err);
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

export const getMembershipRequests = async (req: Request, res: Response) => {
    try {
        const [requests] = await pool.execute(`
            SELECT r.*, u.name as user_name, u.email as user_email 
            FROM membership_requests r 
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: '멤버십 요청 목록을 불러오는데 실패했습니다.' });
    }
};

export const approveMembershipRequest = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { adminComment } = req.body;

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // 1. Get request info
        const [requests] = await connection.execute('SELECT * FROM membership_requests WHERE id = ?', [id]) as any[];
        if (requests.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: '요청을 찾을 수 없습니다.' });
        }
        const request = requests[0];

        // 2. Update request status
        await connection.execute(
            'UPDATE membership_requests SET status = "approved", admin_comment = ? WHERE id = ?',
            [adminComment || 'Approved by admin', id]
        );

        // 3. Create/Update membership
        // Default to yearly for manual approval as per user instruction for "membership"
        const startDate = new Date();
        const endDate = new Date();
        endDate.setFullYear(startDate.getFullYear() + 1);

        await connection.execute(
            'INSERT INTO memberships (user_id, type, status, start_date, end_date) VALUES (?, ?, ?, ?, ?)',
            [request.user_id, 'yearly', 'active', startDate, endDate]
        );

        await connection.commit();
        res.json({ message: '멤버십이 승인되었습니다.' });
    } catch (err) {
        await connection.rollback();
        console.error(err);
        res.status(500).json({ message: '승인 처리 중 오류가 발생했습니다.' });
    } finally {
        connection.release();
    }
};
