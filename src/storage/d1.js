// storage/d1.js

class D1Storage {
    constructor(db) {
        this.db = db;
    }

    async store(id, file) {
        const arrayBuffer = await file.arrayBuffer();
        await this.db.prepare(
            'INSERT INTO files (id, filename, size, storage_type, content) VALUES (?, ?, ?, ?, ?)'
        ).bind(id, file.name, file.size, 'd1', arrayBuffer).run();
    }

    async retrieve(id) {
        const result = await this.db.prepare(
            'SELECT * FROM files WHERE id = ?'
        ).bind(id).first();

        if (result) {
            return {
                stream: new Response(result.content).body,
                filename: result.filename,
                storage_type: 'd1'
            };
        }
        return null;
    }
}

export { D1Storage };
