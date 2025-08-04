import { ArticleRepository } from "./articleRepository";
import { IArticle } from "../../utils/interfaces";
import { IUserPreferenceRepository } from "../interfaces/IUserPreferenceRepository";
import { INotificationRepository } from "../interfaces/INotificationRepository";

export class PersonalizedArticleRepository extends ArticleRepository {
    constructor(
        private userPreferenceRepo: IUserPreferenceRepository,
        private notificationRepository: INotificationRepository
    ) {
        super();
    }

    async findPersonalizedArticlesByDate(userId: number, date: string): Promise<IArticle[]> {
        const articles = await super.findByDate(date);
        return this.scoreAndSortArticles(userId, articles);
    }

    async findPersonalizedArticlesByRange(userId: number, start: string, end: string): Promise<IArticle[]> {
        const articles = await super.findByRange(start, end);
        return this.scoreAndSortArticles(userId, articles);
    }

    async findPersonalizedArticlesByDateAndCategory(userId: number, date: string, categoryName: string): Promise<IArticle[]> {
        const articles = await super.findByDateAndCategory(date, categoryName);
        return this.scoreAndSortArticles(userId, articles);
    }

    async searchPersonalizedArticles(
        userId: number,
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]> {
        const articles = await super.searchArticles(query, fromDate, toDate, sortBy);
        return this.scoreAndSortArticles(userId, articles);
    }

    private async scoreAndSortArticles(userId: number, articles: IArticle[]): Promise<IArticle[]> {
        const userKeywords = await this.userPreferenceRepo.getUserKeywords(userId);
        const userCategories = await this.userPreferenceRepo.getUserCategories(userId);
        const notificationKeywords = await this.getUserNotificationKeywords(userId);

        const scored = await Promise.all(
            articles.map(async (article) => {
                const score = await this.calculateArticleScore(article.article_id, userKeywords, userCategories, notificationKeywords);
                return { ...article, score };
            })
        );

        scored.sort((a, b) => b.score - a.score);

        return scored.map(({ score, ...rest }) => rest);
    }

    private async calculateArticleScore(
        articleId: number,
        userKeywords: string[],
        userCategories: number[],
        notificationKeywords: string[]
    ): Promise<number> {
        const [articleKeywords, articleCategories] = await Promise.all([
            this.getArticleKeywords(articleId),
            this.getArticleCategories(articleId)
        ]);

        const keywordScore = this.scoreMatches(articleKeywords, userKeywords, 3);
        const notificationScore = this.scoreMatches(articleKeywords, notificationKeywords, 2);
        const categoryScore = this.scoreMatches(articleCategories, userCategories, 1);

        return keywordScore + notificationScore + categoryScore;
    }

    private scoreMatches<T>(items: T[], preferences: T[], weight: number): number {
        if (!items.length || !preferences.length) return 0;
        const prefSet = new Set(preferences);
        const matchCount = items.filter((item) => prefSet.has(item)).length;
        return matchCount * weight;
    }

    async getUserNotificationKeywords(userId: number): Promise<string[]> {
        const settings = await this.notificationRepository.getUserSettings(userId);
        return settings.flatMap(setting => setting.keywords);
      }
}
