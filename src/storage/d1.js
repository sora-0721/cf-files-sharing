// storage/d1.js

class D1Storage {
    constructor(db) {
        this.db = db;
    }

    // 将二进制数据转换为 Base64 字符串的函数
    arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

    // 将 Base64 字符串转换回二进制数据的函数
    base64ToArrayBuffer(base64) {
        const binaryString = atob(base64);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes.buffer;
    }

    async store(id, file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            // 将 ArrayBuffer 转换为 Base64 字符串
            const base64String = this.arrayBufferToBase64(arrayBuffer);

            await this.db.prepare(
                'INSERT INTO files (id, filename, size, storage_type, content) VALUES (?, ?, ?, ?, ?)'
            ).bind(id, file.name, file.size, 'd1', base64String).run();
        } catch (error) {
            console.error('D1 store error:', error);
            throw error;
        }
    }

    async retrieve(id) {
        try {
            const result = await this.db.prepare(
                'SELECT * FROM files WHERE id = ?'
            ).bind(id).first();

            if (result) {
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
}

export { D1Storage };
