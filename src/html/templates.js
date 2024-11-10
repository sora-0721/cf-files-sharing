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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      animation: backgroundAnimation 10s infinite alternate;
    }
    @keyframes backgroundAnimation {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    .login-form {
      background: rgba(255, 255, 255, 0.85);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      width: 100%;
      max-width: 400px;
      margin: 1rem;
      backdrop-filter: blur(10px);
      animation: formFadeIn 0.8s ease-out;
    }
    @keyframes formFadeIn {
      from { opacity: 0; transform: translateY(-20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    input {
      width: 100%;
      padding: 12px;
      margin: 12px 0;
      border: 1px solid #ddd;
      border-radius: 6px;
      box-sizing: border-box;
      font-size: 16px;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #3498db;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s, transform 0.2s;
    }
    button:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
      text-align: center;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #333;
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

export const mainTemplate = (lang = 'en', files = []) => {
  const isZh = lang === 'zh';

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }
  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '文件分享' : 'File Share'}</title>
  <style>
    /* CSS 样式 */
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
      animation: backgroundAnimation 10s infinite alternate;
      color: #333;
    }
    @keyframes backgroundAnimation {
      0% { background-position: 0% 50%; }
      100% { background-position: 100% 50%; }
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      animation: containerFadeIn 1s ease-out;
    }
    @keyframes containerFadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .upload-form {
      background: rgba(255, 255, 255, 0.85);
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      position: relative;
      backdrop-filter: blur(10px);
      margin-bottom: 2rem;
    }
    .upload-form h2 {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .drag-drop {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1rem;
      position: relative;
      transition: background 0.3s, border-color 0.3s;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.5);
    }
    .drag-drop.hover {
      background: rgba(255, 255, 255, 0.8);
      border-color: #3498db;
    }
    .drag-drop input[type="file"] {
      display: none;
    }
    .drag-drop p {
      margin: 0;
      font-size: 18px;
      color: #666;
    }
    .drag-drop .file-list {
      margin-top: 1rem;
      text-align: left;
      max-height: 150px;
      overflow-y: auto;
    }
    .drag-drop .file-list li {
      list-style: none;
      margin-bottom: 0.5rem;
      color: #333;
    }
    .drag-drop .upload-btn,
    .drag-drop .open-btn {
      padding: 12px 24px;
      background: #3498db;
      color: #fff;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
      margin: 0.5rem;
    }
    .drag-drop .upload-btn:hover,
    .drag-drop .open-btn:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .storage-options {
      margin: 1rem 0;
      text-align: center;
    }
    .progress {
      width: 100%;
      height: 6px;
      background: #eee;
      margin: 1rem 0;
      display: none;
      border-radius: 3px;
      overflow: hidden;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #8e44ad);
      width: 0%;
      transition: width 0.3s;
    }
    .result {
      margin-top: 1rem;
      padding: 1rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 6px;
      display: none;
      animation: resultFadeIn 0.5s ease-out;
    }
    @keyframes resultFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    button {
      background: #3498db;
      color: #fff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }
    button:hover {
      background: #2980b9;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    a {
      color: #3498db;
      text-decoration: none;
      transition: color 0.3s;
    }
    a:hover {
      color: #2980b9;
    }
    .file-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
      background: rgba(255, 255, 255, 0.85);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }
    .file-table th, .file-table td {
      border-bottom: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      color: #333;
    }
    .file-table th {
      background: #f9f9f9;
      color: #555;
    }
    .file-table tr:last-child td {
      border-bottom: none;
    }
    .delete-btn {
      background: #e74c3c;
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: background 0.3s, transform 0.2s;
    }
    .delete-btn:hover {
      background: #c0392b;
      transform: translateY(-2px);
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .fee-warning {
      margin-top: 1rem;
      color: #888;
      font-size: 0.9rem;
      text-align: center;
    }
    .uploading-indicator {
      display: none;
      margin-top: 1rem;
      text-align: center;
    }
    .uploading-indicator img {
      width: 50px;
      height: 50px;
    }
    .logout-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: transparent;
      color: #333;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: color 0.3s;
    }
    .logout-btn:hover {
      color: #e74c3c;
    }
    /* Notification bar */
    #notificationBar {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      background: #2ecc71;
      color: #fff;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      border-radius: 6px;
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
      transition: bottom 0.5s ease-in-out;
    }
    #notificationBar.show {
      bottom: 20px;
    }
    #notificationBar .message {
      flex-grow: 1;
      font-size: 16px;
    }
    #notificationBar .close-btn {
      background: none;
      border: none;
      color: #fff;
      font-size: 1.5rem;
      cursor: pointer;
      margin-left: 1rem;
      transition: transform 0.2s;
    }
    #notificationBar .close-btn:hover {
      transform: rotate(90deg);
    }
    /* 响应式设计 */
    @media (max-width: 600px) {
      .upload-form {
        padding: 1rem;
      }
      .drag-drop {
        padding: 1rem;
      }
      .file-table th, .file-table td {
        padding: 8px;
      }
      .logout-btn {
        padding: 5px 10px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <button class="logout-btn" onclick="logout()">${isZh ? '退出登录' : 'Logout'}</button>
    <div class="upload-form">
      <h2>${isZh ? '上传文件' : 'Upload File'}</h2>
      <div class="drag-drop" id="dragDropArea">
        <p>${isZh ? '将文件拖拽到此处' : 'Drag and drop files here'}</p>
        <ul class="file-list" id="fileList"></ul>
        <input type="file" id="fileInput" multiple>
        <button class="open-btn" onclick="document.getElementById('fileInput').click()">${isZh ? '选择文件' : 'Choose Files'}</button>
        <button class="upload-btn" onclick="uploadFiles()">${isZh ? '上传' : 'Upload'}</button>
      </div>
      <div class="storage-options">
        <label>${isZh ? '存储方式' : 'Storage'}:</label>
        <select id="storageType">
          <option value="r2">R2 ${isZh ? '存储' : 'Storage'}</option>
          <option value="d1">D1 ${isZh ? '数据库' : 'Database'}</option>
        </select>
      </div>
      <div class="fee-warning" id="feeWarning"></div>
      <div class="progress">
        <div class="progress-bar" id="progressBar"></div>
      </div>
      <div class="uploading-indicator" id="uploadingIndicator">
        <p>${isZh ? '正在上传...' : 'Uploading...'}</p>
        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwgAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIgjI+pq+D9mDEd0dW1HUFW6XoYAOw==" alt="Uploading">
      </div>
      <div class="result" id="uploadResult"></div>
    </div>

    <table class="file-table">
      <thead>
        <tr>
          <th>${isZh ? '文件名' : 'Filename'}</th>
          <th>${isZh ? '大小' : 'Size'}</th>
          <th>${isZh ? '存储类型' : 'Storage Type'}</th>
          <th>${isZh ? '创建时间' : 'Created At'}</th>
          <th>${isZh ? '分享链接' : 'Share Link'}</th>
          <th>${isZh ? '操作' : 'Actions'}</th>
        </tr>
      </thead>
      <tbody>
        ${files
          .map(
            (file) => `
          <tr>
            <td>${file.filename}</td>
            <td>${formatSize(file.size)}</td>
            <td>${file.storage_type.toUpperCase()}</td>
            <td>${new Date(file.created_at).toLocaleString(
              lang === 'zh' ? 'zh-CN' : 'en-US'
            )}</td>
            <td>
              <button onclick="copyLink('${file.id}', this)">${
              isZh ? '复制链接' : 'Copy Link'
            }</button>
            </td>
            <td><button class="delete-btn" onclick="confirmDelete(this, '${
              file.id
            }')">${isZh ? '删除' : 'Delete'}</button></td>
          </tr>
        `
          )
          .join('')}
      </tbody>
    </table>
  </div>

  <div id="notificationBar">
    <span class="message"></span>
    <button class="close-btn" onclick="hideNotification()">×</button>
  </div>

  <script>
    function formatSize(bytes) {
      if (bytes < 1024) return bytes + ' B';
      if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
      if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
      return (bytes / 1073741824).toFixed(2) + ' GB';
    }

    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const feeWarning = document.getElementById('feeWarning');
    const progressBar = document.getElementById('progressBar');
    const progress = document.querySelector('.progress');
    const uploadResult = document.getElementById('uploadResult');
    const uploadingIndicator = document.getElementById('uploadingIndicator');
    const storageTypeSelect = document.getElementById('storageType');
    const notificationBar = document.getElementById('notificationBar');
    const notificationMessage = notificationBar.querySelector('.message');
    const lang = navigator.language.includes('zh') ? 'zh' : 'en';

    dragDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragDropArea.classList.add('hover');
    });

    dragDropArea.addEventListener('dragleave', () => {
      dragDropArea.classList.remove('hover');
    });

    dragDropArea.addEventListener('drop', (e) => {
      e.preventDefault();
      dragDropArea.classList.remove('hover');
      fileInput.files = e.dataTransfer.files;
      updateFileList();
    });

    fileInput.addEventListener('change', updateFileList);

    function updateFileList() {
      fileList.innerHTML = '';
      const files = fileInput.files;
      let totalSize = 0;
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        totalSize += file.size;
        const li = document.createElement('li');
        li.textContent = file.name + ' (' + formatSize(file.size) + ')';
        fileList.appendChild(li);
      }
      const estimatedCost = (
        (totalSize / (1024 * 1024 * 1024)) *
        0.02
      ).toFixed(2); // 假设每GB 0.02美元
      feeWarning.textContent =
        lang === 'zh'
          ? \`预计费用：\$\${estimatedCost}\`
          : \`Estimated cost: \$\${estimatedCost}\`;
    }

    async function uploadFiles() {
      const files = fileInput.files;
      if (files.length === 0) return;

      progress.style.display = 'block';
      progressBar.style.width = '0%';
      uploadResult.style.display = 'none';
      uploadingIndicator.style.display = 'block';

      const storageType = storageTypeSelect.value;

      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // 保留对存储介质的选择
        let currentStorageType = storageType;
        if (
          file.size > 25 * 1024 * 1024 &&
          currentStorageType !== 'r2'
        ) {
          currentStorageType = 'r2';
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('storage', currentStorageType);

        try {
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
          }

          const data = await response.json();
          const shareUrl = \`\${window.location.origin}/file/\${data.id}\`;

          uploadResult.style.display = 'block';
          uploadResult.innerHTML += \`
            <p>\${
              lang === 'zh'
                ? '文件上传成功：'
                : 'File uploaded successfully:'
            } <a href="\${shareUrl}" target="_blank">\${data.filename}</a></p>
          \`;

          showNotification(
            lang === 'zh' ? '文件上传成功' : 'File uploaded successfully',
            'success'
          );
        } catch (error) {
          uploadResult.style.display = 'block';
          uploadResult.innerHTML +=
            (lang === 'zh' ? '上传失败: ' : 'Upload failed: ') +
            error.message +
            '<br>';
          showNotification(
            (lang === 'zh' ? '上传失败: ' : 'Upload failed: ') +
              error.message,
            'error'
          );
        }

        progressBar.style.width = \`\${((i + 1) / files.length) * 100}%\`;
      }

      uploadingIndicator.style.display = 'none';

      // 刷新页面以显示更新后的文件列表
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    function showNotification(message, type = 'success') {
      notificationMessage.textContent = message;
      notificationBar.style.background =
        type === 'success' ? '#2ecc71' : '#e74c3c';
      notificationBar.classList.add('show');
      setTimeout(() => {
        hideNotification();
      }, 5000);
    }

    function hideNotification() {
      notificationBar.classList.remove('show');
    }

    function confirmDelete(button, id) {
      if (button.dataset.confirmed) {
        // 执行删除
        deleteFile(id);
      } else {
        button.textContent =
          lang === 'zh' ? '确认删除' : 'Confirm Delete';
        button.dataset.confirmed = true;
        button.style.background = '#f39c12';
        setTimeout(() => {
          button.textContent = lang === 'zh' ? '删除' : 'Delete';
          delete button.dataset.confirmed;
          button.style.background = '#e74c3c';
        }, 3000); // 3 秒后重置按钮
      }
    }

    async function deleteFile(id) {
      const formData = new FormData();
      formData.append('id', id);

      try {
        const response = await fetch('/delete', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // 刷新页面
          window.location.reload();
        } else {
          showNotification(
            lang === 'zh' ? '删除失败' : 'Failed to delete',
            'error'
          );
        }
      } catch (error) {
        showNotification(
          (lang === 'zh' ? '删除失败: ' : 'Failed to delete: ') +
            error.message,
          'error'
        );
      }
    }

    function copyLink(id, button) {
      const link = \`\${window.location.origin}/file/\${id}\`;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          showNotification(
            lang === 'zh' ? '链接已复制' : 'Link copied to clipboard',
            'success'
          );
          button.textContent = lang === 'zh' ? '已复制' : 'Copied';
          button.style.background = '#2ecc71';
          setTimeout(() => {
            button.textContent =
              lang === 'zh' ? '复制链接' : 'Copy Link';
            button.style.background = '';
          }, 2000);
        })
        .catch((err) => {
          showNotification(
            lang === 'zh' ? '无法复制链接' : 'Failed to copy link',
            'error'
          );
        });
    }

    function logout() {
      if (
        confirm(
          lang === 'zh'
            ? '确定要退出登录吗？'
            : 'Are you sure you want to logout?'
        )
      ) {
        fetch('/logout', {
          method: 'POST',
        }).then(() => {
          window.location.href = '/auth';
        });
      }
    }
  </script>
</body>
</html>
`;
};
