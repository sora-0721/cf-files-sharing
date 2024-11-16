// src/storage/r2.js

class R2Storage {
    constructor(bucket) {
        this.bucket = bucket;
    }

    async store(id, file) {
        await this.bucket.put(id, file.stream());
    }

    async retrieve(id) {
        const object = await this.bucket.get(id);
        if (object) {
            return {
                stream: object.body,
                // 文件名和存储类型将在 StorageManager 中添加
            };
        }
        return null;
    }

    async delete(id) {
        try {
            await this.bucket.delete(id);
            return true;
        } catch (error) {
            console.error('R2 delete error:', error);
            return false;
        }
    }

    // 不再需要 list 方法，因为文件列表从 D1 获取
}

export { R2Storage };
