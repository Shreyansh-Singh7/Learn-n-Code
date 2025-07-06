import { IArticle } from '../../utils/interfaces';

export interface IArticleRepository {
    articleExists(articleId: number): Promise<boolean>;
    saveArticle(article: IArticle): Promise<number>;
    saveArticleKeywords(articleId: number, keywords: string[]): Promise<void>;
    saveArticleCategory(articleId: number, categoryId: number): Promise<void>;
    findByDate(date: string): Promise<IArticle[]>;
    findByRange(start: string, end: string): Promise<IArticle[]>;
    findByDateAndCategory(date: string, categoryName: string): Promise<IArticle[]>;
    findArticlesByIds(articleIds: number[]): Promise<IArticle[]>;
    getArticleCategories(articleId: number): Promise<number[]>;
    getArticleKeywords(articleId: number): Promise<string[]>;
    findArticlesSince(since: Date): Promise<IArticle[]>
    getLatestArticleCreatedAt(): Promise<Date | null>;
    searchArticles(
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]>;
}
