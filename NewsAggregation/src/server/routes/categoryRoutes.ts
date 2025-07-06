import categoryController from '../controllers/categoryController';
import { Router } from 'express';
const router = Router();

router.use('/category', categoryController);

export default router;
