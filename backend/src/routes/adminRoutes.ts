import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { authenticateToken } from '../middleware/auth';
import { authenticateAdmin } from '../middleware/admin';

const router = Router();

// All routes here require both token and admin role
router.use(authenticateToken, authenticateAdmin);

router.get('/users', adminController.getUsers);
router.get('/memberships', adminController.getMemberships);

router.get('/contents', adminController.getContents);
router.post('/contents', adminController.createContent);
router.put('/contents/:id', adminController.updateContent);
router.delete('/contents/:id', adminController.deleteContent);

router.get('/membership-requests', adminController.getMembershipRequests);
router.put('/membership-requests/:id/approve', adminController.approveMembershipRequest);

export default router;
