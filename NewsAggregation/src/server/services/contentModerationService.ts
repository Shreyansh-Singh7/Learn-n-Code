import { IBlockedKeyword } from '../../utils/interfaces';
import { IContentModerationRepository } from '../interfaces/IContentModerationRepository';

export interface IContentModerationService{
    hideArticle(articleId: number): Promise<void>;
    hideCategory(categoryId: number): Promise<void>;
    addBlockedKeyword(keyword: string): Promise<void>;
    removeBlockedKeyword(keyword: string): Promise<void>;
    getBlockedKeywords(): Promise<IBlockedKeyword[]>;
}

export class ContentModerationService implements IContentModerationService {
    constructor(private contentModerationRepository: IContentModerationRepository) { }

    async hideArticle(articleId: number): Promise<void> {
        await this.contentModerationRepository.hideArticle(articleId);
    }

    async hideCategory(categoryId: number): Promise<void> {
        await this.contentModerationRepository.hideCategory(categoryId);
        await this.contentModerationRepository.hideArticlesByCategory(categoryId);
    }

    async addBlockedKeyword(keyword: string) {
        this.contentModerationRepository.addBlockedKeyword(keyword);
        await this.contentModerationRepository.hideArticlesByKeyword(keyword);
    }

    async removeBlockedKeyword(keyword: string) {
        this.contentModerationRepository.removeBlockedKeyword(keyword);
    }

    async getBlockedKeywords() {
        return this.contentModerationRepository.getBlockedKeywords();
    }
}
