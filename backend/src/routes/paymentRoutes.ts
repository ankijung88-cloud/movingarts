import express from 'express';
import { verifyPayment } from '../controllers/paymentController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.post('/verify', authenticateToken, verifyPayment);

export default router;
