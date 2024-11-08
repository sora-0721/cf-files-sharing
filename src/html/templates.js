export const loginTemplate = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Login - File Share</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                margin: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                background: #fff;
            }
            .login-form {
                background: #fff;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                width: 100%;
                max-width: 400px;
                margin: 1rem;
            }
            input {
                width: 100%;
                padding: 8px;
                margin: 8px 0;
                border: 1px solid #ddd;
                border-radius: 4px;
                box-sizing: border-box;
            }
            button {
                width: 100%;
                padding: 10px;
                background: #000;
                color: #fff;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background: #333;
            }
        </style>
    </head>
    <body>
        <div class="login-form">
            <h2>Login</h2>
            <form method="POST" action="/auth">
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
            </form>
        </div>
    </body>
    </html>
    `;
};

export const mainTemplate = () => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>File Share</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, sans-serif;
                margin: 0;
                padding: 20px;
                background: #fff;
                color: #000;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
            }
            .upload-form {
                background: #fff;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .storage-options {
                margin: 1rem 0;
            }
            .progress {
                width: 100%;
                height: 4px;
                background: #eee;
                margin: 1rem 0;
                display: none;
            }
            .progress-bar {
                height: 100%;
                background: #000;
                width: 0%;
                transition: width 0.3s;
            }
            .result {
                margin-top: 1rem;
                padding: 1rem;
                background: #f8f8f8;
                border-radius: 4px;
                display: none;
            }
            button {
                background: #000;
                color: #fff;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
            }
            button:hover {
                background: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="upload-form">
                <h2>Upload File</h2>
                <input type="file" id="fileInput" required>
                <div class="storage-options">
                    <label>Storage:</label>
                    <select id="storageType">
                        <option value="r2">R2 Storage</option>
                        <option value="d1">D1 Database</option>
                    </select>
                </div>
                <button onclick="uploadFile()">Upload</button>
                <div class="progress">
                    <div class="progress-bar"></div>
                </div>
                <div class="result"></div>
            </div>
        </div>

        <script>
            async function uploadFile() {
                const fileInput = document.getElementById('fileInput');
                const storageSelect = document.getElementById('storageType');
                const progressBar = document.querySelector('.progress-bar');
                const progress = document.querySelector('.progress');
                const result = document.querySelector('.result');

                const file = fileInput.files[0];
                if (!file) return;

                if (file.size > 25 * 1024 * 1024) {
                    storageSelect.value = 'r2';
                    storageSelect.disabled = true;
                }

                const formData = new FormData();
                formData.append('file', file);
                formData.append('storage', storageSelect.value);

                progress.style.display = 'block';
                result.style.display = 'none';

                try {
                    const response = await fetch('/upload', {
                        method: 'POST',
                        body: formData
                    });

                    const data = await response.json();
                    const shareUrl = \`\${window.location.origin}/file/\${data.id}\`;
                    
                    result.style.display = 'block';
                    result.innerHTML = \`
                        <p>File uploaded successfully!</p>
                        <p>Share URL: <a href="\${shareUrl}" target="_blank">\${shareUrl}</a></p>
                    \`;
                } catch (error) {
                    result.style.display = 'block';
                    result.innerHTML = 'Upload failed: ' + error.message;
                }
            }
        </script>
    </body>
    </html>
    `;
};