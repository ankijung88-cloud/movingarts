"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateAdmin = void 0;
const authenticateAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: '접근 권한이 없습니다. 관리자만 이용 가능합니다.' });
    }
};
exports.authenticateAdmin = authenticateAdmin;
