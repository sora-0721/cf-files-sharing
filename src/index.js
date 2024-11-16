// src/index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate, previewTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
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
      const formData = await request.formData();
      const id = formData.get('id');

      const success = await storageManager.delete(id);

      if (success) {
        return jsonResponse({ success: true });
      } else {
        return jsonResponse({ success: false }, 400);
      }
    }

    // 文件上传处理
    if (url.pathname === '/upload' && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      let storageType = formData.get('storage');

      // 保留对存储介质的选择
      if (file.size > 25 * 1024 * 1024 && storageType !== 'r2') {
        storageType = 'r2'; // 大于25MB的文件强制使用R2
      }

      const previewEnabled = formData.get('previewEnabled') === 'true' || formData.get('previewEnabled') === 'on';
      const path = formData.get('path') || '';

      const metadata = await storageManager.store(file, storageType, previewEnabled, path);

      return jsonResponse({
        id: metadata.id,
        filename: metadata.filename,
        path: metadata.path,
        size: metadata.size,
        storage_type: metadata.storage_type,
        preview_enabled: metadata.preview_enabled,
      });
    }

    // 主页面
    if (url.pathname === '/') {
      const files = await storageManager.list();

      return htmlResponse(mainTemplate(lang, files));
    }

    return errorResponse(lang === 'zh' ? '未找到页面' : 'Not found', 404);
  },
};
