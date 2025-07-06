import { IArticleReactionRepository } from '../interfaces/IArticleReactionRepository';

export interface IArticleReactionService {
    reactToArticle(userId: number, articleId: number, reaction: 'like' | 'dislike'): Promise<void>;
}

export class ArticleReactionService implements IArticleReactionService {
    constructor(private reactionRepo: IArticleReactionRepository) { }

    async reactToArticle(userId: number, articleId: number, newReaction: 'like' | 'dislike'): Promise<void> {
        const existingReaction = await this.reactionRepo.getUserReaction(userId, articleId);

        if (existingReaction === newReaction) {
            await this.reactionRepo.removeReaction(userId, articleId);
            await this.reactionRepo.updateArticleReactionCount(articleId, newReaction === 'like' ? 'likes' : 'dislikes', -1);
            return;
        }

        if (existingReaction) {
            await this.reactionRepo.updateArticleReactionCount(articleId, existingReaction === 'like' ? 'likes' : 'dislikes', -1);
        }

        await this.reactionRepo.addOrUpdateReaction(userId, articleId, newReaction);
        await this.reactionRepo.updateArticleReactionCount(articleId, newReaction === 'like' ? 'likes' : 'dislikes', 1);
    }
}
