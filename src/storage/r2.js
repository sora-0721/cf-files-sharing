// storage/r2.js

class R2Storage {
    constructor(bucket) {
        this.bucket = bucket;
    }

    async store(id, file) {
        await this.bucket.put(id, file.stream(), {
            metadata: {
                filename: file.name
            }
        });
    }

    async retrieve(id) {
        const object = await this.bucket.get(id);
        if (object) {
            return {
                stream: object.body,
                filename: object.metadata?.filename,
                storage_type: 'r2'
            };
        }
        return null;
    }
}

export { R2Storage };
