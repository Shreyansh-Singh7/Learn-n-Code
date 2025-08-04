import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IArticle } from '../../utils/interfaces';
import { IArticleRepository } from '../interfaces/IArticleRepository';

export class ArticleRepository implements IArticleRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async articleExists(articleId: number): Promise<boolean> {
        const query = 'SELECT 1 FROM articles WHERE article_id = ?';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [articleId]);
        return rows.length > 0;
    }

    async findArticlesByIds(articleIds: number[]): Promise<IArticle[]> {
        if (!articleIds.length) return [];
        const placeholders = articleIds.map(() => '?').join(',');
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT * FROM articles WHERE article_id IN (${placeholders}) AND is_hidden = FALSE`, articleIds
        );
        return rows as IArticle[];
    }

    async saveArticle(article: IArticle): Promise<number> {
        const query = `
            INSERT INTO articles (title, description, url, image_url, source, language, published_at)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [
            article.title,
            article.description,
            article.url,
            article.image_url,
            article.source,
            article.language,
            article.published_at
        ];
        const [result] = await this.pool.execute<ResultSetHeader>(query, values);
        return result.insertId;
    }

    async saveArticleKeywords(articleId: number, keywords: string[]): Promise<void> {
        const query = 'INSERT INTO article_keywords (article_id, keyword) VALUES (?, ?)';
        const promises = keywords.map(keyword => this.pool.execute(query, [articleId, keyword]));
        await Promise.all(promises);
    }

    async saveArticleCategory(articleId: number, categoryId: number): Promise<void> {
        const query = 'INSERT INTO article_categories (article_id, category_id) VALUES (?, ?)';
        await this.pool.execute(query, [articleId, categoryId]);
    }

    async findByDate(date: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT * FROM articles WHERE DATE(published_at) = ? AND is_hidden = FALSE ORDER BY published_at DESC',
            [date]
        );
        return rows as IArticle[];
    }

    async findByRange(start: string, end: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT * FROM articles WHERE DATE(published_at) BETWEEN ? AND ? AND is_hidden = FALSE ORDER BY published_at DESC',
            [start, end]
        );
        return rows as IArticle[];
    }

    async findByDateAndCategory(date: string, categoryName: string): Promise<IArticle[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT a.* FROM articles a
           JOIN article_categories ac ON a.article_id = ac.article_id
           JOIN categories c ON ac.category_id = c.category_id
           WHERE DATE(a.published_at) >= ? AND c.category_name = ? AND a.is_hidden = FALSE
           ORDER BY a.published_at DESC`,
            [date, categoryName]
        );
        return rows as IArticle[];
    }

    async getArticleCategories(articleId: number): Promise<number[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT category_id FROM article_categories WHERE article_id = ?`,
            [articleId]
        );
        return rows.map(r => r.category_id);
    }

    async getArticleKeywords(articleId: number): Promise<string[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            `SELECT keyword FROM article_keywords WHERE article_id = ?`,
            [articleId]
        );
        return rows.map(r => r.keyword);
    }
    
    async findArticlesSince(since: Date): Promise<IArticle[]> {
        const query = `SELECT * FROM articles WHERE created_at > ? AND is_hidden = FALSE ORDER BY created_at ASC`;
        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [since]);
        return rows as IArticle[];
    }

    async getLatestArticleCreatedAt(): Promise<Date | null> {
        const sql = `SELECT created_at FROM articles ORDER BY created_at DESC LIMIT 1`;
        const [rows] = await this.pool.execute<RowDataPacket[]>(sql);
        if (!rows.length) return null;
        return new Date(rows[0].created_at);
      }
    
    async searchArticles(
        query: string,
        fromDate?: string,
        toDate?: string,
        sortBy?: 'likes' | 'dislikes'
    ): Promise<IArticle[]> {
        let sql = `
            SELECT *
            FROM articles
            WHERE title LIKE ? AND is_hidden = FALSE
        `;

        const params: any[] = [`%${query}%`];

        if (fromDate) {
            sql += ` AND published_at >= ?`;
            params.push(fromDate);
        }

        if (toDate) {
            sql += ` AND published_at <= ?`;
            params.push(toDate);
        }

        if (sortBy === 'likes') {
            sql += ` ORDER BY likes DESC`;
        } else if (sortBy === 'dislikes') {
            sql += ` ORDER BY dislikes DESC`;
        } else {
            sql += ` ORDER BY published_at DESC`;
        }

        const [rows] = await this.pool.query(sql, params);
        return rows as IArticle[];
    }
}
