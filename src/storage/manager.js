// src/storage/manager.js

import { R2Storage } from './r2';
import { D1Storage } from './d1';
import { generateId } from '../utils/id';

class StorageManager {
  constructor(env) {
    this.r2Storage = new R2Storage(env.FILE_BUCKET);
    this.d1Storage = new D1Storage(env.DB);
    this.settingsTable = 'settings'; // 新增的设置表名
  }

  // 存储单个文件
  async store(file, storageType) {
    const id = generateId();
    const metadata = {
      id,
      filename: file.fullPath || file.name, // 使用完整路径
      size: file.size,
      storage_type: storageType,
      created_at: new Date().toISOString(),
    };

    if (storageType === 'r2') {
      await this.r2Storage.store(id, file);
      // 存储元数据到 D1
      await this.d1Storage.storeMetadata(metadata);
    } else {
      await this.d1Storage.store(id, file);
    }

    return metadata;
  }

  async retrieve(id) {
    // 从 D1 获取元数据
    const metadata = await this.d1Storage.getMetadata(id);
    if (!metadata) {
      return null;
    }

    let file = null;
    if (metadata.storage_type === 'd1') {
      file = await this.d1Storage.retrieve(id);
    } else if (metadata.storage_type === 'r2') {
      file = await this.r2Storage.retrieve(id);
    }

    if (file) {
      file.filename = metadata.filename;
      file.storage_type = metadata.storage_type;
    }

    return file;
  }

  async delete(id) {
    // 从 D1 获取元数据
    const metadata = await this.d1Storage.getMetadata(id);
    if (!metadata) {
      return false;
    }

    let success = false;
    if (metadata.storage_type === 'd1') {
      success = await this.d1Storage.delete(id);
    } else if (metadata.storage_type === 'r2') {
      success = await this.r2Storage.delete(id);
    }

    if (success) {
      // 删除 D1 中的元数据
      await this.d1Storage.deleteMetadata(id);
    }

    return success;
  }

  async list() {
    // 仅从 D1 获取文件列表
    const files = await this.d1Storage.list();
    return files;
  }

  async getMetadata(id) {
    return await this.d1Storage.getMetadata(id);
  }

  // 设置相关方法
  async saveSettings(settings) {
    // 假设只有一个用户，或者基于token识别用户
    // 这里简化处理，存储单个设置
    const existing = await this.d1Storage.getAll(this.settingsTable);
    if (existing.length > 0) {
      // 更新现有设置
      await this.d1Storage.update(this.settingsTable, { id: existing[0].id }, settings);
    } else {
      // 插入新设置
      await this.d1Storage.insert(this.settingsTable, { ...settings, id: generateId(8) });
    }
  }

  async loadSettings() {
    const settings = await this.d1Storage.getAll(this.settingsTable);
    if (settings.length > 0) {
      return settings[0];
    }
    // 返回默认设置
    return {};
  }
}

export { StorageManager };
