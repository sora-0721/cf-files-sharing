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

export const mainTemplate = (lang = 'en', files = []) => {
  const isZh = lang === 'zh';

  // 定义 formatSize 函数
  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  };

  // 生成表格行内容
  const tableRows = files.map(file => `
    <tr>
      <td>
        <a href="/file/${file.id}" target="_blank">${file.filename}</a>
        ${file.preview_enabled ? ` | <a href="/preview/${file.id}" target="_blank">${isZh ? '预览' : 'Preview'}</a>` : ''}
      </td>
      <td>${file.path || ''}</td>
      <td>${formatSize(file.size)}</td>
      <td>${file.storage_type.toUpperCase()}</td>
      <td>${new Date(file.created_at).toLocaleString(lang)}</td>
      <td><button class="delete-btn" onclick="deleteFile('${file.id}')">${isZh ? '删除' : 'Delete'}</button></td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '文件分享' : 'File Share'}</title>
  <style>
    /* CSS 样式 */
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
      position: relative;
    }
    .drag-drop {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1rem;
      position: relative;
    }
    .drag-drop.hover {
      background: #f9f9f9;
    }
    .drag-drop input[type="file"] {
      display: none;
    }
    .drag-drop p {
      margin: 0;
    }
    .drag-drop .file-list {
      margin-top: 1rem;
      text-align: left;
    }
    .drag-drop .file-list li {
      list-style: none;
      margin-bottom: 0.5rem;
    }
    .drag-drop .upload-btn {
      position: absolute;
      bottom: 10px;
      right: 10px;
    }
    .drag-drop .open-btn {
      position: absolute;
      bottom: 10px;
      left: 10px;
    }
    .storage-options, .preview-option {
      margin: 1rem 0;
      text-align: center;
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
    .error-log {
      margin-top: 1rem;
      color: red;
      font-size: 0.9rem;
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
    .file-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
    }
    .file-table th, .file-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }
    .file-table th {
      background: #f9f9f9;
    }
    .delete-btn {
      background: red;
      color: #fff;
      border: none;
      padding: 5px 10px;
      border-radius: 4px;
      cursor: pointer;
    }
    .delete-btn:hover {
      background: darkred;
    }
    .fee-warning {
      margin-top: 1rem;
      color: #888;
      font-size: 0.9rem;
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
  </style>
</head>
<body>
  <div class="container">
    <div class="upload-form">
      <h2>${isZh ? '上传文件' : 'Upload File'}</h2>
      <div class="drag-drop" id="dragDropArea">
        <p>${isZh ? '将文件或文件夹拖拽到此处' : 'Drag and drop files or folders here'}</p>
        <ul class="file-list" id="fileList"></ul>
        <input type="file" id="fileInput" multiple webkitdirectory directory>
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
      <div class="preview-option">
        <label>
          <input type="checkbox" id="previewEnabled">
          ${isZh ? '启用在线预览' : 'Enable Online Preview'}
        </label>
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
      <div class="error-log" id="errorLog"></div>
    </div>

    <table class="file-table">
      <thead>
        <tr>
          <th>${isZh ? '文件名' : 'Filename'}</th>
          <th>${isZh ? '路径' : 'Path'}</th>
          <th>${isZh ? '大小' : 'Size'}</th>
          <th>${isZh ? '存储类型' : 'Storage Type'}</th>
          <th>${isZh ? '创建时间' : 'Created At'}</th>
          <th>${isZh ? '操作' : 'Actions'}</th>
        </tr>
      </thead>
      <tbody>
        ${tableRows}
      </tbody>
    </table>
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
    const previewEnabledCheckbox = document.getElementById('previewEnabled');
    const errorLog = document.getElementById('errorLog');
    const lang = navigator.language.includes('zh') ? 'zh' : 'en';

    let filesToUpload = [];

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
      handleFiles(e.dataTransfer.items || e.dataTransfer.files);
    });

    fileInput.addEventListener('change', () => {
      handleFiles(fileInput.files);
    });

    function handleFiles(items) {
      filesToUpload = [];
      fileList.innerHTML = '';
      let totalSize = 0;

      const traverseFileTree = (item, path = '') => {
        if (item.isFile) {
          item.file((file) => {
            file.fullPath = path + file.name;
            filesToUpload.push(file);
            totalSize += file.size;
            const li = document.createElement('li');
            li.textContent = file.fullPath + ' (' + formatSize(file.size) + ')';
            fileList.appendChild(li);
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          dirReader.readEntries((entries) => {
            entries.forEach((entry) => {
              traverseFileTree(entry, path + item.name + '/');
            });
          });
        }
      };

      if (items instanceof FileList) {
        for (let i = 0; i < items.length; i++) {
          const file = items[i];
          file.fullPath = file.webkitRelativePath || file.name;
          filesToUpload.push(file);
          totalSize += file.size;
          const li = document.createElement('li');
          li.textContent = file.fullPath + ' (' + formatSize(file.size) + ')';
          fileList.appendChild(li);
        }
      } else {
        for (let i = 0; i < items.length; i++) {
          const item = items[i].webkitGetAsEntry ? items[i].webkitGetAsEntry() : items[i];
          if (item) {
            traverseFileTree(item);
          }
        }
      }

const estimatedCost = ((totalSize / (1024 * 1024 * 1024)) * 0.02).toFixed(2); // 假设每GB 0.02美元
feeWarning.textContent = lang === 'zh'
  ? '预计费用：$${estimatedCost}'
  : 'Estimated cost: $${estimatedCost}';
}

    async function uploadFiles() {
      if (filesToUpload.length === 0) return;

      progress.style.display = 'block';
      progressBar.style.width = '0%';
      uploadResult.style.display = 'none';
      uploadingIndicator.style.display = 'block';
      errorLog.innerHTML = '';

      const storageType = storageTypeSelect.value;
      const previewEnabled = previewEnabledCheckbox.checked;

      for (let i = 0; i < filesToUpload.length; i++) {
        const file = filesToUpload[i];

        // 保留对存储介质的选择
        let currentStorageType = storageType;
        if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
          currentStorageType = 'r2';
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('storage', currentStorageType);
        formData.append('previewEnabled', previewEnabled);
        formData.append('path', file.fullPath ? file.fullPath.replace(file.name, '') : '');

        try {
          const response = await fetch('/upload', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(response.statusText);
          }

          const data = await response.json();
          const shareUrl = '${window.location.origin}/file/${data.id}';

          uploadResult.style.display = 'block';
          uploadResult.innerHTML += '
            <p>${lang === 'zh' ? '文件上传成功：' : 'File uploaded successfully:'} <a href="${shareUrl}" target="_blank">${data.filename}</a></p>
          ';

        } catch (error) {
          errorLog.innerHTML += '
            <p>${lang === 'zh' ? '上传失败：' : 'Upload failed:'} ${file.fullPath || file.name} - ${error.message}</p>
          ';
        }

        progressBar.style.width = '${((i + 1) / filesToUpload.length) * 100}%';
      }

      uploadingIndicator.style.display = 'none';

      // 刷新页面以显示更新后的文件列表
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }

    async function deleteFile(id) {
      if (!confirm(lang === 'zh' ? '确定删除此文件？' : 'Are you sure you want to delete this file?')) {
        return;
      }

      const formData = new FormData();
      formData.append('id', id);

      try {
        const response = await fetch('/delete', {
          method: 'POST',
          body: formData,
        });

        const result = await response.json();

        if (result.success) {
          // 移除文件行
          window.location.reload();
        } else {
          alert(lang === 'zh' ? '删除失败' : 'Failed to delete');
        }
      } catch (error) {
        alert(lang === 'zh' ? '删除失败: ' : 'Failed to delete: ' + error.message);
      }
    }
  </script>
</body>
</html>
`;
};

export const previewTemplate = (lang = 'en', file, id) => {
  const isZh = lang === 'zh';
  let contentHtml = '';
  const filename = file.filename.toLowerCase();

  if (filename.match(/\.(jpg|jpeg|png|gif|bmp)$/)) {
    // 图片预览
    const fileUrl = `/file/${id}`;
    contentHtml = `<img src="${fileUrl}" alt="${file.filename}" style="max-width: 100%; height: auto;">`;
  } else if (filename.match(/\.(mp4|webm|ogg)$/)) {
    // 视频预览
    const fileUrl = `/file/${id}`;
    contentHtml = `<video controls style="max-width: 100%; height: auto;">
                   <source src="${fileUrl}" type="video/${filename.split('.').pop()}">
                 </video>`;
  } else if (filename.match(/\.(mp3|wav|ogg)$/)) {
    // 音频预览
    const fileUrl = `/file/${id}`;
    contentHtml = `<audio controls>
                   <source src="${fileUrl}" type="audio/${filename.split('.').pop()}">
                 </audio>`;
  } else if (filename.match(/\.(pdf)$/)) {
    // PDF 预览
    const fileUrl = `/file/${id}`;
    contentHtml = `<iframe src="${fileUrl}" style="width:100%; height:100vh;" frameborder="0"></iframe>`;
  } else if (filename.match(/\.(txt|md|js|css|html|json|xml)$/)) {
    // 文本文件预览
    const fileUrl = `/file/${id}`;
    contentHtml = `<iframe src="${fileUrl}" style="width:100%; height:100vh;" frameborder="0"></iframe>`;
  } else {
    // 其他文件类型
    contentHtml = `<p>${isZh ? '无法预览此文件类型。' : 'Cannot preview this file type.'}</p>`;
  }

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${file.filename}</title>
  <style>
    body {
      margin: 0;
      background: #000;
      color: #fff;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      position: relative;
    }
    .download-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: rgba(0, 0, 0, 0.7);
      color: #fff;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    .download-btn:hover {
      background: rgba(0, 0, 0, 0.9);
    }
    .content {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  <button class="download-btn" onclick="window.location.href='/file/${id}'">${isZh ? '下载' : 'Download'}</button>
  <div class="content">
    ${contentHtml}
  </div>
</body>
</html>
`;
};
