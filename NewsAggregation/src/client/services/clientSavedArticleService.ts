import * as dotenv from 'dotenv';
import { IArticle } from '../../utils/interfaces';

dotenv.config();

export class ClientSavedArticleService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async saveArticleForUser(articleId: number, userId: number): Promise<void> {
        const res = await fetch(`${this.baseUrl}/save`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, articleId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }

    async removeSavedArticle(articleId: number, userId: number): Promise<void> {
        const res = await fetch(`${this.baseUrl}/unsave`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId, articleId })
        });
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
    }

    async getSavedArticles(userId: number): Promise<IArticle[]> {
        const res = await fetch(`${this.baseUrl}/saved/${userId}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IArticle[];
    }
}
