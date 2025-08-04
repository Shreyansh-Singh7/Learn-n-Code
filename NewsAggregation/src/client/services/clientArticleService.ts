import * as dotenv from 'dotenv';
import { IArticle } from '../../utils/interfaces';

dotenv.config();

export class ClientArticleService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async getTodayHeadlines(): Promise<IArticle[]> {
        const res = await fetch(`${this.baseUrl}/news/headlines/today`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IArticle[];
    }

    async getCategoryHeadlines(date: string, category: string): Promise<IArticle[]> {
        const res = await fetch(`${this.baseUrl}/news/headlines?category=${encodeURIComponent(category)}&date=${encodeURIComponent(date)}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IArticle[];
    }

    async getRangeHeadlines(start: string, end: string): Promise<IArticle[]> {
        const res = await fetch(`${this.baseUrl}/news/headlines/range?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`);
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IArticle[];
    }

    async searchArticles(query: string, fromDate?: string, toDate?: string, sort?: string): Promise<IArticle[]> {
        const url = new URL(`${this.baseUrl}/news/search`);
        url.searchParams.append('q', query);
        if (fromDate) url.searchParams.append('fromDate', fromDate);
        if (toDate) url.searchParams.append('toDate', toDate);
        if (sort) url.searchParams.append('sort', sort);

        const res = await fetch(url.toString());
        const json = await res.json();
        if (!json.success) throw new Error(json.error);
        return json.data as IArticle[];
    }
}
