import { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { getDbPool } from '../config/database';
import { ExternalServer } from '../models/externalNewsServer';

export interface IExternalServerRepository {
    listServers(): Promise<ExternalServer[]>;
    getByName(name: string): Promise<ExternalServer | null>;
    getApiKeyByName(name: string): Promise<String |  null>
    updateApiKey(name: string, newKey: string): Promise<void>;
  }
export class ExternalNewsServerRepository implements IExternalServerRepository {
    private pool: Pool = getDbPool();

    async listServers(): Promise<ExternalServer[]> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT server_id, name, api_key, status, last_accessed FROM news_servers'
        );
        return rows.map(row => ExternalServer.fromRow(row));
    }

    async getByName(name: string): Promise<ExternalServer | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT server_id, name, api_key, status, last_accessed FROM news_servers WHERE name = ?',
            [name]
        );
        if (!rows.length) return null;
        return ExternalServer.fromRow(rows[0]);
    }

    async updateApiKey(name: string, newKey: string): Promise<void> {
        const [result] = await this.pool.execute<ResultSetHeader>(
            'UPDATE news_servers SET api_key = ? WHERE name = ?',
            [newKey, name]
        );
        if (result.affectedRows === 0) {
            throw new Error(`No server found with name '${name}'`);
        }
    }
    async getApiKeyByName(name: string): Promise<string | null> {
        const [rows] = await this.pool.execute<RowDataPacket[]>(
            'SELECT api_key FROM news_servers WHERE name = ? AND status = "Active"',
            [name]
        );
        return rows.length ? rows[0].api_key : null;
    }

    async updateLastAccessed(name: string): Promise<void> {
        const sql = `UPDATE news_servers 
                     SET last_accessed = NOW() 
                     WHERE name = ?`;
        const [result] = await this.pool.execute<ResultSetHeader>(sql, [name]);
        if (result.affectedRows === 0) {
            console.warn(`Warning: server '${name}' not found to update last_accessed`);
        }
    }
}
