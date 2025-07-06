export class ExternalServer {
    constructor(
        public readonly serverId: number,
        public readonly name: string,
        public apiKey: number,
        public readonly status: string,
        public readonly lastAccessed: Date
    ) { }

    static fromRow(row: any): ExternalServer {
        return new ExternalServer(
            row.server_id,
            row.name,
            row.api_key,
            row.status,
            new Date(row.last_accessed)
        );
    }
}