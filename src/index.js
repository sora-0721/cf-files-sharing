// src/index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const storageManager = new StorageManager(env);

    // 获取用户的语言偏好
    const acceptLanguage = request.headers.get('Accept-Language') || 'en';
    const lang = acceptLanguage.includes('zh') ? 'zh' : 'en';

    // 文件下载处理
    if (url.pathname.startsWith('/file/')) {
      const id = url.pathname.split('/')[2];
      const file = await storageManager.retrieve(id);

      if (!file) {
        return errorResponse(lang === 'zh' ? '文件未找到' : 'File not found', 404);
      }

      return new Response(file.stream, {
        headers: {
          'Content-Disposition': `attachment; filename="${file.filename}"`,
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

    // 文件上传处理
    if (url.pathname === '/upload' && request.method === 'POST') {
      const formData = await request.formData();
      const file = formData.get('file');
      let storageType = formData.get('storage');

      if (file.size > 25 * 1024 * 1024) {
        storageType = 'r2';
      }

      const metadata = await storageManager.store(file, storageType);

      return jsonResponse({
        id: metadata.id,
        filename: metadata.filename,
        size: metadata.size,
        storage_type: metadata.storage_type,
      });
    }

    // 主页面
    if (url.pathname === '/') {
      return htmlResponse(mainTemplate(lang));
    }

    return errorResponse(lang === 'zh' ? '未找到页面' : 'Not found', 404);
  },
};
