// src/storage/d1.js

class D1Storage {
  constructor(db) {
    this.db = db;
  }

  // 存储文件（用于存储在 D1 中的文件）
  async store(id, file) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // 将 ArrayBuffer 转换为 Base64 字符串
      const base64String = this.arrayBufferToBase64(arrayBuffer);

      await this.db.prepare(
        'INSERT INTO files (id, filename, size, storage_type, created_at, content) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, ?)'
      ).bind(id, file.name, file.size, 'd1', base64String).run();
    } catch (error) {
      console.error('D1 store error:', error);
      throw error;
    }
  }

  // 存储元数据（用于存储在 R2 中的文件）
  async storeMetadata(metadata) {
    try {
      await this.db.prepare(
        'INSERT INTO files (id, filename, size, storage_type, created_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(metadata.id, metadata.filename, metadata.size, metadata.storage_type, metadata.created_at).run();
    } catch (error) {
      console.error('D1 storeMetadata error:', error);
      throw error;
    }
  }

  // 获取文件内容和元数据
  async retrieve(id) {
    try {
      const result = await this.db.prepare(
        'SELECT * FROM files WHERE id = ?'
      ).bind(id).first();

      if (result && result.content) {
        // 将 Base64 字符串解码回 ArrayBuffer
        const arrayBuffer = this.base64ToArrayBuffer(result.content);

        return {
          stream: new Response(arrayBuffer).body,
          filename: result.filename,
          storage_type: 'd1'
        };
      }
      return null;
    } catch (error) {
      console.error('D1 retrieve error:', error);
      throw error;
    }
  }

  // 获取元数据
  async getMetadata(id) {
    try {
      const result = await this.db.prepare(
        'SELECT id, filename, size, storage_type, created_at FROM files WHERE id = ?'
      ).bind(id).first();
      return result;
    } catch (error) {
      console.error('D1 getMetadata error:', error);
      return null;
    }
  }

  // 删除文件内容和元数据
  async delete(id) {
    try {
      const result = await this.db.prepare(
        'DELETE FROM files WHERE id = ?'
      ).bind(id).run();
      return result.success;
    } catch (error) {
      console.error('D1 delete error:', error);
      return false;
    }
  }

  // 删除元数据
  async deleteMetadata(id) {
    // 对于 D1 存储，delete 方法已经删除了元数据，此处可不做操作
    return true;
  }

  // 列出所有文件
  async list() {
    try {
      const results = await this.db.prepare(
        'SELECT id, filename, size, storage_type, created_at FROM files ORDER BY created_at DESC'
      ).all();
      return results.results || [];
    } catch (error) {
      console.error('D1 list error:', error);
      return [];
    }
  }

  // 工具函数：ArrayBuffer 转 Base64
  arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  // 工具函数：Base64 转 ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
  }
}

export { D1Storage };
