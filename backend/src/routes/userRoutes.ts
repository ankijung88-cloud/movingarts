import express from 'express';
import { register, login, getProfile, findEmail, resetPasswordRequest } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.post('/find-email', findEmail);
router.post('/reset-password-request', resetPasswordRequest);

export default router;
