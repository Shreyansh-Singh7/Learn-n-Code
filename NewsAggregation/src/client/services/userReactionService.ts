import * as dotenv from 'dotenv';
dotenv.config();

export class UserReactionService {
    private readonly baseUrl = process.env.BASE_API_URL;

    async reactToArticle(userId: number, articleId: number, reaction: 'like' | 'dislike'): Promise<boolean> {
        try {
            const res = await fetch(`${this.baseUrl}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, articleId, reaction })
            });
            const json = await res.json();
            return json.success;
        } catch {
            return false;
        }
    }
}
