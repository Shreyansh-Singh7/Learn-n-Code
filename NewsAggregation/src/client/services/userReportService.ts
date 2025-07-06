import * as dotenv from 'dotenv';
dotenv.config();

export class UserReportService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async reportArticle(userId: number, articleId: number, reason: string): Promise<boolean> {
        try {
            const res = await fetch(`${this.baseUrl}/report`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, articleId, reason })
            });
            const json = await res.json();
            return json.success;
        } catch {
            return false;
        }
    }
}
