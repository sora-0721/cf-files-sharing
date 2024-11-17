// src/index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate, viewTemplate, embedTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const storageManager = new StorageManager(env);

    // 获取用户的语言偏好
    const acceptLanguage = request.headers.get('Accept-Language') || 'en';
    const langParam = url.searchParams.get('lang');
    const lang = langParam ? langParam : (acceptLanguage.includes('zh') ? 'zh' : 'en');

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

    // 文件浏览处理
    if (url.pathname.startsWith('/view/')) {
      const id = url.pathname.split('/')[2];
      const file = await storageManager.retrieve(id);

      if (!file) {
        return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
      }

      // 获取文件的元数据
      const metadata = await storageManager.getMetadata(id);
      if (!metadata) {
        return errorResponse(lang === 'zh' ? '文件元数据未找到' : 'File metadata not found', 404);
      }

      // 生成预览页面
      const previewHtml = viewTemplate(lang, metadata);

      return new Response(previewHtml, {
        headers: { 'Content-Type': 'text/html' },
      });
    }

    // 文件嵌入处理
    if (url.pathname.startsWith('/embed/')) {
      const id = url.pathname.split('/')[2];
      const file = await storageManager.retrieve(id);

      if (!file) {
        return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
      }

      // 生成嵌入页面
      const embedHtml = embedTemplate(lang, file);

      return new Response(embedHtml, {
        headers: { 'Content-Type': 'text/html' },
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

    // 退出登录
    if (url.pathname === '/logout') {
      if (request.method === 'POST') {
        const expiredCookie = Auth.createExpiredCookie();
        return new Response('', {
          status: 302,
          headers: {
            'Location': '/auth',
            'Set-Cookie': expiredCookie,
          },
        });
      } else {
        return new Response('', {
          status: 405,
          headers: {
            'Allow': 'POST',
          },
        });
      }
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
      const files = formData.getAll('file'); // 获取所有文件
      let storageType = formData.get('storage');

      let results = [];
      let errors = [];

      for (let file of files) {
        // 根据文件大小选择存储方式
        let currentStorageType = storageType;
        if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
          currentStorageType = 'r2';
        }

        try {
          const metadata = await storageManager.store(file, currentStorageType);

          results.push({
            id: metadata.id,
            filename: metadata.filename,
            size: metadata.size,
            storage_type: metadata.storage_type,
          });
        } catch (error) {
          console.error('Upload error:', error);
          errors.push({
            filename: file.name,
            message: error.message,
          });
        }
      }

      if (errors.length > 0) {
        return jsonResponse({ results, errors }, 207); // 207 Multi-Status
      }

      return jsonResponse({ results });
    }

    // 设置保存处理
    if (url.pathname === '/settings' && request.method === 'POST') {
      const requestBody = await request.json();
      const userSettings = requestBody;

      // 假设只有一个用户，或者基于token识别用户
      // 这里简化处理，存储单个设置
      try {
        await storageManager.saveSettings(userSettings);
        return jsonResponse({ success: true });
      } catch (error) {
        console.error('Settings save error:', error);
        return jsonResponse({ error: error.message }, 500);
      }
    }

    // 设置加载处理
    if (url.pathname === '/settings' && request.method === 'GET') {
      try {
        const settings = await storageManager.loadSettings();
        return jsonResponse({ settings });
      } catch (error) {
        console.error('Settings load error:', error);
        return jsonResponse({ error: error.message }, 500);
      }
    }

    // 主页面
    if (url.pathname === '/') {
      const files = await storageManager.list();
      const settings = await storageManager.loadSettings();

      return htmlResponse(mainTemplate(lang, files, settings));
    }

    return errorResponse(lang === 'zh' ? '未找到页面' : 'Not found', 404);
  },
};
