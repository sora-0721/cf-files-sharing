// index.js

import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate } from './html/templates';
import { jsonResponse, htmlResponse, errorResponse } from './utils/response';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const storageManager = new StorageManager(env);

    // File download endpoint
    if (url.pathname.startsWith('/file/')) {
      const id = url.pathname.split('/')[2];
      const file = await storageManager.retrieve(id);

      if (!file) {
        return errorResponse('File not found', 404);
      }

      return new Response(file.stream, {
        headers: {
          'Content-Disposition': `attachment; filename="${file.filename}"`,
          'Content-Type': 'application/octet-stream',
        },
      });
    }

    // Authentication check
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
          return htmlResponse(loginTemplate('Invalid password'));
        }
      }
      return htmlResponse(loginTemplate());
    }

    // Handle file upload
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

    // Main page
    if (url.pathname === '/') {
      return htmlResponse(mainTemplate());
    }

    return errorResponse('Not found', 404);
  },
};
