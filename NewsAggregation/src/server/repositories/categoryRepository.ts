import { Pool, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { IArticle } from '../../utils/interfaces';

export class CategoryRepository {
    private pool: Pool;

    constructor() {
        this.pool = getDbPool();
    }

    async findCategoryIdByName(name: string): Promise<number | null> {
        const query = 'SELECT category_id FROM categories WHERE category_name = ?';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query, [name]);
        if (rows.length === 0) return null;
        return rows[0].category_id;
    }

    async createCategory(name: string): Promise<number> {
        const query = 'INSERT INTO categories (category_name) VALUES (?)';
        const [result]: any = await this.pool.execute(query, [name]);
        return result.insertId;
    }

    async getOrCreateCategoryId(name: string): Promise<number> {
        let categoryId = await this.findCategoryIdByName(name);
        if (categoryId) return categoryId;
        return this.createCategory(name);
    }

    async exists(name: string): Promise<boolean> {
        const query = 'SELECT 1 FROM categories WHERE category_name = ? LIMIT 1';
        const [rows] = await this.pool.execute<RowDataPacket[]>(query,[name]);
        return rows.length > 0;
      }

    //TODO: Refactor logic of categorization.
    async inferOrCreateCategory(article: IArticle): Promise<number> {
        const text = `${article.title} ${article.description}`.toLowerCase();
        let categoryName = 'General';
        if (/(business|market|stock)/.test(text)) categoryName = 'Business';
        else if (/(sport|game|match|tournament)/.test(text)) categoryName = 'Sports';
        else if (/(entertainment|movie|music|tv)/.test(text)) categoryName = 'Entertainment';
        else if (/(tech|technology|computer|software)/.test(text)) categoryName = 'Technology';

        return await this.getOrCreateCategoryId(categoryName);
      }
}
