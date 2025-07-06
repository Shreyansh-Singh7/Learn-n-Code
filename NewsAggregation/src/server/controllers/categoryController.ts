import { Request, Response, NextFunction, Router } from 'express';
import { CategoryService } from '../services/categoryService';

const router = Router();
const service = new CategoryService();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { category_name } = req.body;
        const newCategory = await service.createCategory(category_name);
        res.status(201).json({ success: true, data: newCategory });
    } catch (err: any) {
        next(err);
    }
});

export default router;
