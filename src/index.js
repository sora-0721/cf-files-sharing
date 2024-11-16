// src/index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate, previewTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const storageManager = new StorageManager(env);

      // 获取用户的语言偏好
      const acceptLanguage = request.headers.get('Accept-Language') || 'en';
      const lang = acceptLanguage.includes('zh') ? 'zh' : 'en';

      // 文件预览处理
      if (url.pathname.startsWith('/preview/')) {
        const id = url.pathname.split('/')[2];
        const file = await storageManager.retrieve(id);

        if (!file) {
          return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
        }

        if (!file.preview_enabled) {
          return errorResponse(lang === 'zh' ? '预览不可用' : 'Preview not available', 403);
        }

        // 返回预览页面
        return htmlResponse(previewTemplate(lang, file, id));
      }

      // 文件下载处理
      if (url.pathname.startsWith('/file/')) {
        const id = url.pathname.split('/')[2];
        const file = await storageManager.retrieve(id);

        if (!file) {
          return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
        }

        // 解决中文文件名下载问题
        const filename = file.filename;
        const encodedFilename = encodeURIComponent(filename);
        const contentDisposition = `attachment; filename="${encodedFilename}"; filename*=UTF-8''${encodedFilename}`;

        return new Response(file.stream, {
          headers: {
            'Content-Disposition': contentDisposition,
            'Content-Type': 'application/octet-stream',
          },
        });
      }

      // 认证检查
      if (!(await Auth.verifyAuth(request, env))) {
        if (url.pathname === '/auth' && request.method === 'POST') {
          const formData = await request.formData();
          const password = formData.get('password');

          if (await Auth.validatePassword(password, env)) {
            const token = await Auth.generateToken(env);
            const cookie = Auth.createCookie(token);

            return new Response('', {
              status: 302,
              headers: {
                'Location': '/',
                'Set-Cookie': cookie,
              },
            });
          } else {
            return htmlResponse(loginTemplate(lang, lang === 'zh' ? '密码错误' : 'Invalid password'));
          }
        }
        return htmlResponse(loginTemplate(lang));
      }

      // 文件删除处理
      if (url.pathname === '/delete' && request.method === 'POST') {
        try {
          const formData = await request.formData();
          const id = formData.get('id');

          const success = await storageManager.delete(id);

          if (success) {
            return jsonResponse({ success: true });
          } else {
            return jsonResponse({ success: false }, 400);
          }
        } catch (error) {
          console.error('Delete handler error:', error);
          return errorResponse(lang === 'zh' ? '删除时发生错误' : 'Error during deletion', 500);
        }
      }

      // 文件上传处理
      if (url.pathname === '/upload' && request.method === 'POST') {
        try {
          const formData = await request.formData();
          const files = formData.getAll('file'); // 支持多文件上传
          const storageType = formData.get('storage');
          const previewEnabled = formData.get('previewEnabled') === 'true' || formData.get('previewEnabled') === 'on';

          const uploadResults = [];

          for (const file of files) {
            let currentStorageType = storageType;
            if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
              currentStorageType = 'r2'; // 大于25MB的文件强制使用R2
            }

            // 获取文件路径
            const path = formData.get('path') || '';

            try {
              const metadata = await storageManager.store(file, currentStorageType, previewEnabled, path);
              uploadResults.push({
                success: true,
                id: metadata.id,
                filename: metadata.filename,
                path: metadata.path,
                size: metadata.size,
                storage_type: metadata.storage_type,
                preview_enabled: metadata.preview_enabled,
              });
            } catch (uploadError) {
              console.error(`Upload error for file ${file.name}:`, uploadError);
              uploadResults.push({
                success: false,
                filename: file.name,
                error: uploadError.message,
              });
            }
          }

          return jsonResponse({ results: uploadResults });
        } catch (error) {
          console.error('Upload handler error:', error);
          return errorResponse(lang === 'zh' ? '上传时发生错误' : 'Error during upload', 500);
        }
      }

      // 主页面
      if (url.pathname === '/') {
        try {
          const files = await storageManager.list();

          // 定义 formatSize 函数
          const formatSize = (bytes) => {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
            if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
            return (bytes / 1073741824).toFixed(2) + ' GB';
          };

          // 预格式化文件大小
          const formattedFiles = files.map(file => ({
            ...file,
            formattedSize: formatSize(file.size)
          }));

          return htmlResponse(mainTemplate(lang, formattedFiles));
        } catch (error) {
          console.error('Main handler error:', error);
          return errorResponse(lang === 'zh' ? '加载主页面时发生错误' : 'Error loading main page', 500);
        }
      }

      return errorResponse(lang === 'zh' ? '未找到页面' : 'Not found', 404);
    } catch (error) {
      console.error('Unhandled fetch error:', error);
      return new Response('Internal Server Error', { status: 500 });
    }
  },
};
