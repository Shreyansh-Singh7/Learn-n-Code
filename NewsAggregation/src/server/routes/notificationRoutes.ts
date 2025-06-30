import express from 'express';
import {
  getNotifications,
  getNotificationConfig,
  toggleCategory,
  updateKeywords,
} from '../controllers/notificationController.ts';
import { authenticateToken } from '../middleware/authMiddleware.ts';

const router = express.Router();

router.use(authenticateToken);

router.get('/', getNotifications);
router.get('/config', getNotificationConfig);
router.post('/category', toggleCategory);
router.post('/keywords', updateKeywords);

export default router;
