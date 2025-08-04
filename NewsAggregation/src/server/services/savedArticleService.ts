import { IArticle } from '../../utils/interfaces';
import { IArticleRepository } from '../interfaces/IArticleRepository';
import { ISavedArticleRepository } from '../interfaces/ISavedArticleRepository';

export interface ISavedArticleService {
    saveArticleForUser(userId: number, articleId: number): Promise<number>;
    removeSavedArticle(userId: number, articleId: number): Promise<void>;
    getSavedArticles(userId: number): Promise<IArticle[]>;
}

export class SavedArticleService implements ISavedArticleService {
    constructor(
        private savedArticleRepository: ISavedArticleRepository,
        private articleRepository: IArticleRepository
    ) { }

    async saveArticleForUser(userId: number, articleId: number): Promise<number> {
        return this.savedArticleRepository.save(userId, articleId);
    }

    async removeSavedArticle(userId: number, articleId: number): Promise<void> {
        return this.savedArticleRepository.delete(userId, articleId);
    }

    async getSavedArticles(userId: number): Promise<IArticle[]> {
        const savedItems = await this.savedArticleRepository.getSavedArticlesIds(userId);
        const ids = savedItems.map(s => s.article_id);
        return this.articleRepository.findArticlesByIds(ids);
    }
}
