import { Pool, createPool } from 'mysql2/promise';
import * as dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;

export function getDbPool(): Pool {
    if (!pool) {
        pool = createPool({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '3306'),
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'news_aggregation',
        });
    }
    return pool;
}

export async function closeDbPool(): Promise<void> {
    if (pool) {
        await pool.end();
        pool = null;
    }
}
