import { Auth } from './auth';
import { StorageManager } from './storage/manager';
import { loginTemplate, mainTemplate } from './html/templates';

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const storageManager = new StorageManager(env);

        // File download endpoint
        if (url.pathname.startsWith('/file/')) {
            const id = url.pathname.split('/')[2];
            const file = await storageManager.retrieve(id);
            
            if (!file) {
                return new Response('File not found', { status: 404 });
            }

            return new Response(file.stream, {
                headers: {
                    'Content-Disposition': `attachment; filename="${file.filename}"`,
                    'Content-Type': 'application/octet-stream'
                }
            });
        }

        // Auth check
        if (!await Auth.verifyAuth(request, env)) {
            if (url.pathname === '/auth' && request.method === 'POST') {
                // ... (previous auth code remains the same)
            }
            return new Response(loginTemplate(), {
                headers: { 'Content-Type': 'text/html' }
            });
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
            return new Response(JSON.stringify(metadata), {
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Main page
        if (url.pathname === '/') {
            return new Response(mainTemplate(), {
                headers: { 'Content-Type': 'text/html' }
            });
        }

        return new Response('Not found', { status: 404 });
    }
};