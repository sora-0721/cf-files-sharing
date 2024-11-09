// src/html/templates.js

export const loginTemplate = (lang = 'en', message = '') => {
  const isZh = lang === 'zh';
  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '登录 - 文件分享' : 'Login - File Share'}</title>
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
    .error-message {
      color: red;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="login-form">
    <h2>${isZh ? '登录' : 'Login'}</h2>
    ${message ? `<p class="error-message">${message}</p>` : ''}
    <form method="POST" action="/auth">
      <input type="password" name="password" placeholder="${isZh ? '密码' : 'Password'}" required>
      <button type="submit">${isZh ? '登录' : 'Login'}</button>
    </form>
  </div>
</body>
</html>
`;
};

export const mainTemplate = (lang = 'en') => {
  const isZh = lang === 'zh';
  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '文件分享' : 'File Share'}</title>
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
    a {
      color: #000;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="upload-form">
      <h2>${isZh ? '上传文件' : 'Upload File'}</h2>
      <input type="file" id="fileInput" required>
      <div class="storage-options">
        <label>${isZh ? '存储方式' : 'Storage'}:</label>
        <select id="storageType">
          <option value="r2">R2 ${isZh ? '存储' : 'Storage'}</option>
          <option value="d1">D1 ${isZh ? '数据库' : 'Database'}</option>
        </select>
      </div>
      <button onclick="uploadFile()">${isZh ? '上传' : 'Upload'}</button>
      <div class="progress">
        <div class="progress-bar"></div>
      </div>
      <div class="result"></div>
    </div>
  </div>

  <script>
    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }

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
      } else {
        storageSelect.disabled = false;
      }

      const estimatedCost = ((file.size / (1024 * 1024)) * 0.02).toFixed(2); // 假设每GB 0.02美元
      const lang = navigator.language.includes('zh') ? 'zh' : 'en';
      const confirmMessage = lang === 'zh'
        ? \`上传此文件可能产生约 \$\${estimatedCost} 的费用。是否继续？\`
        : \`Uploading this file may incur a cost of approximately \$\${estimatedCost}. Do you want to continue?\`;

      if (!confirm(confirmMessage)) {
        return;
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('storage', storageSelect.value);

      progress.style.display = 'block';
      progressBar.style.width = '0%';
      result.style.display = 'none';

      try {
        const response = await fetch('/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        const data = await response.json();
        const shareUrl = \`\${window.location.origin}/file/\${data.id}\`;

        result.style.display = 'block';
        result.innerHTML = \`
          <p>\${lang === 'zh' ? '文件上传成功！' : 'File uploaded successfully!'}</p>
          <p>\${lang === 'zh' ? '分享链接' : 'Share URL'}: <a href="\${shareUrl}" target="_blank">\${shareUrl}</a></p>
        \`;
      } catch (error) {
        result.style.display = 'block';
        result.innerHTML = (lang === 'zh' ? '上传失败: ' : 'Upload failed: ') + error.message;
      }
    }

    // 更新进度条显示（如果需要，可以使用更高级的上传方法）
  </script>
</body>
</html>
`;
};
