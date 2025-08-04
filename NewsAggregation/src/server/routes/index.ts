import express from 'express';
import { AuthRoutes } from './authRoutes';
import { ExternalServerRoutes } from './externalServerRoutes';
import { ArticleRoutes } from './articleRoutes';
import { SavedArticleRoutes } from './savedArticleRoutes';
import categoryRoutes from './categoryRoutes';
import { NotificationRoutes } from './notificationRoutes';
import { ArticleReactionRoutes } from './articleReactionRoutes';
import { ContentModerationRoutes } from './contentModerationRoutes';
import { UserReportRoutes } from './userReportRoutes';

const apiRouter = express.Router();

apiRouter.use(new AuthRoutes().getRouter());
apiRouter.use(new ExternalServerRoutes().getRouter());
apiRouter.use(new ArticleRoutes().getRouter());
apiRouter.use(new SavedArticleRoutes().getRouter());
apiRouter.use(new NotificationRoutes().getRouter());
apiRouter.use(new ArticleReactionRoutes().getRouter());
apiRouter.use(new ContentModerationRoutes().getRouter());
apiRouter.use(new UserReportRoutes().getRouter());
apiRouter.use(categoryRoutes);

export default apiRouter;
