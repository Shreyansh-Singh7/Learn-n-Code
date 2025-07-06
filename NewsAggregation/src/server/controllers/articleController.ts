import { Router, Request, Response, NextFunction } from 'express';
import { IArticleService } from '../services/articleService';
import { IArticle } from '../../utils/interfaces';

export class ArticleController {
    router: Router;
    private articleService: IArticleService;

    constructor(service: IArticleService) {
        this.router = Router();
        this.articleService = service;
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/headlines/today', this.handleToday.bind(this));
        this.router.get('/headlines/range', this.handleRange.bind(this));
        this.router.get('/headlines', this.handleCategory.bind(this));
        this.router.get('/search', this.handleSearch.bind(this));
    }

    private async handleToday(req: Request, res: Response, next: NextFunction) {
        try {
            const articles:IArticle[] = await this.articleService.getTodayHeadlines();
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleRange(req: Request, res: Response, next: NextFunction) {
        try {
            const { start, end } = req.query as { start?: string; end?: string };
            if (!start || !end) {
                res.status(400).json({ success: false, error: 'start and end parameters are required' });
                return;
            }
            const articles: IArticle[] = await this.articleService.getRangeHeadlines(start, end);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    private async handleCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const category = req.query.category as string;
            const date = (req.query.date as string) || "";
            if (!category) {
                res.status(400).json({ success: false, error: 'category parameter is required' });
                return;
            }
            console.log("date: ", date);
            const articles: IArticle[] = await this.articleService.getCategoryHeadlines(date, category);
            res.json({ success: true, data: articles });
        } catch (err: any) {
            next(err);
        }
    }

    public async handleSearch(req: Request, res: Response, next: NextFunction) {
        const { q, fromDate, toDate, sort } = req.query;

        if (!q) {
            res.status(400).json({ success: false, error: 'Search query is required' });
            return
        }

        try {
            const articles: IArticle[] = await this.articleService.searchArticles(
                String(q),
                fromDate ? String(fromDate) : undefined,
                toDate ? String(toDate) : undefined,
                sort === 'likes' || sort === 'dislikes' ? (sort as 'likes' | 'dislikes') : undefined
            );

            res.json({ success: true, data: articles });
        } catch (err) {
            next(err);
        }
    }
}
