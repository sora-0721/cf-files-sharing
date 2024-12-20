// src/storage/r2.js

class R2Storage {
  constructor(bucket) {
    this.bucket = bucket;
  }

  async store(id, file, previewEnabled, path = '') {
    await this.bucket.put(id, file.stream(), {
      customMetadata: {
        filename: file.name,
        path: path,
        size: file.size.toString(),
        created_at: new Date().toISOString(),
        preview_enabled: previewEnabled ? '1' : '0',
      }
    });
  }

  async retrieve(id) {
    const object = await this.bucket.get(id);
    if (object) {
      return {
        stream: object.body,
        filename: object.customMetadata?.filename || 'unknown',
        path: object.customMetadata?.path || '',
        storage_type: 'r2',
        preview_enabled: object.customMetadata?.preview_enabled === '1',
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

  async list() {
    try {
      const options = {
        limit: 500,
        include: ["customMetadata"],
      };
      
      const listed = await this.bucket.list(options);
      
      let truncated = listed.truncated;
      let cursor = truncated ? listed.cursor : undefined;
      
      // ✅ - use the truncated property to check if there are more
      // objects to be returned
      while (truncated) {
        const next = await this.bucket.list.list({
          ...options,
          cursor: cursor,
        });
        listed.objects.push(...next.objects);
      
        truncated = next.truncated;
        cursor = next.cursor;
      }
      const files = listed.objects.map(obj => {
        return {
          id: obj.key,
          filename: obj.customMetadata?.filename || 'unknown',
          path: obj.customMetadata?.path || '',
          size: parseInt(obj.customMetadata?.size) || 0,
          storage_type: 'r2',
          preview_enabled: obj.customMetadata?.preview_enabled === '1',
          created_at: obj.customMetadata?.created_at || obj.uploaded,
        };
      });
      return files;
    } catch (error) {
      console.error('R2 list error:', error);
      return [];
    }
  }
}

export { R2Storage };
