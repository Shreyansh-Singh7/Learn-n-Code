import { IBlockedKeyword } from '../../utils/interfaces';

export interface IContentModerationRepository {
    hideArticle(articleId: number): Promise<void>;
    hideCategory(categoryId: number): Promise<void>;
    hideArticlesByCategory(categoryId: number): Promise<void>;
    hideArticlesByKeyword(keyword: string): Promise<void>;
    addBlockedKeyword(keyword: string): Promise<void>;
    removeBlockedKeyword(keyword: string): Promise<void>;
    getBlockedKeywords(): Promise<IBlockedKeyword[]>;
}
