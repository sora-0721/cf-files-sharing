// src/storage/d1.js

class D1Storage {
    constructor(db) {
        this.db = db;
    }

    // 存储文件
    async store(id, file) {
        const reader = file.stream.getReader();
        const chunks = [];
        let done, value;
        while (!done) {
            ({ done, value } = await reader.read());
            if (value) {
                chunks.push(...value);
            }
        }
        const data = new Uint8Array(chunks);
        await this.db.put(id, data);
    }

    // 存储元数据
    async storeMetadata(metadata) {
        await this.db.put(`metadata_${metadata.id}`, JSON.stringify(metadata));
    }

    // 获取文件
    async retrieve(id) {
        const data = await this.db.get(id);
        if (data) {
            return {
                stream: new ReadableStream({
                    start(controller) {
                        controller.enqueue(data);
                        controller.close();
                    }
                }),
                // 文件名和存储类型将在 StorageManager 中添加
            };
        }
        return null;
    }

    // 获取元数据
    async getMetadata(id) {
        const metadata = await this.db.get(`metadata_${id}`);
        if (metadata) {
            return JSON.parse(metadata);
        }
        return null;
    }

    // 删除文件
    async delete(id) {
        try {
            await this.db.delete(id);
            await this.db.delete(`metadata_${id}`);
            return true;
        } catch (error) {
            console.error('D1 删除错误:', error);
            return false;
        }
    }

    // 列出所有文件
    async list() {
        const files = [];
        for await (const [key, value] of this.db.entries()) {
            if (key.startsWith('metadata_')) {
                const metadata = JSON.parse(value);
                files.push(metadata);
            }
        }
        return files;
    }
}

export { D1Storage };
