// src/storage/d1.js

class D1Storage {
  constructor(db) {
    this.db = db;
    // 定义表名
    this.metadataTable = 'file_metadata';
    this.fileContentsTable = 'file_contents';
    this.settingsTable = 'settings';
  }

  // 添加 prepare 方法
  prepare(query) {
    return this.db.prepare(query);
  }

  // 存储文件元数据
  async storeMetadata(metadata) {
    return await this.db.prepare(`
      INSERT INTO ${this.metadataTable} (id, filename, size, storage_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `).bind(metadata.id, metadata.filename, metadata.size, metadata.storage_type, metadata.created_at).run();
  }

  // 获取文件元数据
  async getMetadata(id) {
    const result = await this.db.prepare(`
      SELECT * FROM ${this.metadataTable} WHERE id = ?
    `).bind(id).first();
    return result;
  }

  // 删除文件元数据
  async deleteMetadata(id) {
    return await this.db.prepare(`
      DELETE FROM ${this.metadataTable} WHERE id = ?
    `).bind(id).run();
  }

  // 列出所有文件
  async list() {
    try {
      const results = await this.db.prepare(`
        SELECT * FROM ${this.metadataTable}
      `).all();
      console.log(`D1Storage.list() returned ${results.length} records.`);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error('D1Storage.list() error:', error);
      return [];
    }
  }

  // 存储文件内容到 D1（假设用于存储小文件）
  async store(id, file) {
    const reader = file.stream.getReader();
    let chunks = [];
    let done, value;
    while (!done) {
      ({ done, value } = await reader.read());
      if (value) {
        chunks.push(...value);
      }
    }
    const blob = new Blob([new Uint8Array(chunks)]);
    const arrayBuffer = await blob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    return await this.db.prepare(`
      INSERT INTO ${this.fileContentsTable} (id, content)
      VALUES (?, ?)
    `).bind(id, buffer).run();
  }

  // 获取文件内容从 D1
  async retrieve(id) {
    try {
      const result = await this.db.prepare(`
        SELECT * FROM ${this.fileContentsTable} WHERE id = ?
      `).bind(id).first();

      if (result) {
        return {
          stream: result.content,
        };
      }
      return null;
    } catch (error) {
      console.error('D1Storage.retrieve() error:', error);
      return null;
    }
  }

  // 删除文件内容从 D1
  async delete(id) {
    try {
      await this.db.prepare(`
        DELETE FROM ${this.fileContentsTable} WHERE id = ?
      `).bind(id).run();
      return true;
    } catch (error) {
      console.error('D1Storage.delete() error:', error);
      return false;
    }
  }

  // 设置相关操作
  async insert(table, data) {
    const keys = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    return await this.db.prepare(`
      INSERT INTO ${table} (${keys})
      VALUES (${placeholders})
    `).bind(...values).run();
  }

  async update(table, condition, data) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const conditionKeys = Object.keys(condition);
    const conditionValues = Object.values(condition);
    return await this.db.prepare(`
      UPDATE ${table} SET ${setClause} WHERE ${conditionKeys.map(key => `${key} = ?`).join(' AND ')}
    `).bind(...values, ...conditionValues).run();
  }

  async getAll(table) {
    try {
      const results = await this.db.prepare(`
        SELECT * FROM ${table}
      `).all();
      console.log(`D1Storage.getAll(${table}) returned ${results.length} records.`);
      return Array.isArray(results) ? results : [];
    } catch (error) {
      console.error(`D1Storage.getAll(${table}) error:`, error);
      return [];
    }
  }
}

export { D1Storage };
