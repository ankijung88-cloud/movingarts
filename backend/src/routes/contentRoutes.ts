import { Router } from 'express';
import pool from '../config/db';
import { authenticateToken } from '../middleware/auth';
import { authenticateMembership } from '../middleware/membership';

const router = Router();

// 모든 라우트에 토큰 인증 및 멤버십 인증 적용
router.use(authenticateToken, authenticateMembership);

router.get('/', async (req, res) => {
    try {
        const [contents] = await pool.execute(
            'SELECT id, title, content, category, created_at FROM research_content ORDER BY created_at DESC'
        );
        res.json(contents);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '콘텐츠를 불러오는데 실패했습니다.' });
    }
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const [contents]: any = await pool.execute(
            'SELECT * FROM research_content WHERE id = ?',
            [id]
        );

        if (contents.length === 0) {
            return res.status(404).json({ message: '콘텐츠를 찾을 수 없습니다.' });
        }

        res.json(contents[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '콘텐츠를 불러오는데 실패했습니다.' });
    }
});

export default router;
