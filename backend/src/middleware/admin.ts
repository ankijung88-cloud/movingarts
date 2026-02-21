import { Request, Response, NextFunction } from 'express';

export const authenticateAdmin = (req: any, res: Response, next: NextFunction) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: '접근 권한이 없습니다. 관리자만 이용 가능합니다.' });
    }
};
