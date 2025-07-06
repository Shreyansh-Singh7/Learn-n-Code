import * as dotenv from 'dotenv';
import { IBlockedKeyword } from '../../utils/interfaces';

dotenv.config();

export class ContentModerationService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async hideArticle(articleId: number): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/hide/article`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ articleId })
            });
        } catch {
            throw new Error('Failed to hide article.');
        }
    }

    async hideCategory(categoryId: number): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/hide/category`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ categoryId })
            });
        } catch {
            throw new Error('Failed to hide category.');
        }
    }

    async addBlockedKeyword(keyword: string): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/keywords`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            });
        } catch {
            throw new Error('Failed to add blocked keyword.');
        }
    }

    async removeBlockedKeyword(keyword: string): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/keywords`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ keyword })
            });
        } catch {
            throw new Error('Failed to remove blocked keyword.');
        }
    }

    async getBlockedKeywords(): Promise<IBlockedKeyword[]> {
        try {
            const res = await fetch(`${this.baseUrl}/keywords`);
            const json = await res.json();
            if (!json.success) return [];
            return json.data as IBlockedKeyword[];
        } catch {
            return [];
        }
    }
}
