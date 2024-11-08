class StorageManager {
    constructor(env) {
        this.r2 = env.FILE_BUCKET;
        this.db = env.DB;
    }

    async store(file, storageType) {
        const id = crypto.randomUUID().slice(0, 8);
        const metadata = {
            id,
            filename: file.name,
            size: file.size,
            storage_type: storageType
        };

        if (storageType === 'r2') {
            await this.r2.put(id, file.stream(), {
                metadata: {
                    filename: file.name
                }
            });
        } else {
            const arrayBuffer = await file.arrayBuffer();
            await this.db.prepare(
                'INSERT INTO files (id, filename, size, storage_type, content) VALUES (?, ?, ?, ?, ?)'
            ).bind(id, file.name, file.size, storageType, arrayBuffer).run();
        }

        return metadata;
    }

    async retrieve(id) {
        // Try R2 first
        const r2Object = await this.r2.get(id);
        if (r2Object) {
            return {
                stream: r2Object.body,
                filename: r2Object.metadata?.filename,
                storage_type: 'r2'
            };
        }

        // Try D1
        const dbResult = await this.db.prepare(
            'SELECT * FROM files WHERE id = ?'
        ).bind(id).first();
        
        if (dbResult) {
            return {
                stream: new Response(dbResult.content).body,
                filename: dbResult.filename,
                storage_type: 'd1'
            };
        }

        return null;
    }
}

export { StorageManager };