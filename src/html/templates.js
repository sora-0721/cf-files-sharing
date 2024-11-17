// src/html/templates.js

export const loginTemplate = (lang = 'zh', message = '') => {
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
      background: #fff;
      color: #000;
    }
    .login-form {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      width: 100%;
      max-width: 400px;
      margin: 1rem;
    }
    input {
      width: 100%;
      padding: 12px;
      margin: 12px 0;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
      font-size: 16px;
      color: #000;
      background: #fff;
    }
    button {
      width: 100%;
      padding: 12px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      transition: background 0.3s;
    }
    button:hover {
      background: #333;
    }
    .error-message {
      color: red;
      margin-bottom: 1rem;
      text-align: center;
    }
    h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #000;
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

export const mainTemplate = (lang = 'zh', files = []) => {
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
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: #fff;
      color: #000;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    .upload-section {
      background: #fff;
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      margin-bottom: 2rem;
      position: relative;
    }
    .upload-section h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: #000;
    }
    .drag-drop {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1rem;
      position: relative;
      transition: background 0.3s;
      border-radius: 8px;
      background: #fff;
    }
    .drag-drop.hover {
      background: #f9f9f9;
    }
    .drag-drop input[type="file"] {
      display: none;
    }
    .drag-drop p {
      margin: 0;
      font-size: 18px;
      color: #000;
    }
    .drag-drop .upload-btn,
    .drag-drop .open-btn {
      padding: 10px 20px;
      background: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      margin: 0.5rem;
    }
    .drag-drop .upload-btn:hover,
    .drag-drop .open-btn:hover {
      background: #333;
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
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    button:hover {
      background: #333;
    }
    a {
      color: #000;
      text-decoration: underline;
      transition: color 0.3s;
    }
    a:hover {
      color: #333;
    }
    .file-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
    }
    .file-table th, .file-table td {
      border-bottom: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      color: #000;
    }
    .file-table th {
      background: #f9f9f9;
      color: #000;
    }
    .file-table tr:last-child td {
      border-bottom: none;
    }
    .delete-btn, .copy-btn {
      background: #000;
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      margin-right: 5px;
    }
    .delete-btn:hover {
      background: red;
    }
    .copy-btn:hover {
      background: #333;
    }
    .embed-btn {
      background: #000;
      color: #fff;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .embed-btn:hover {
      background: #333;
    }
    .fee-warning {
      margin-top: 1rem;
      color: #666;
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
      color: #000;
      font-size: 16px;
      border: none;
      cursor: pointer;
      transition: color 0.3s;
    }
    .logout-btn:hover {
      color: red;
    }
    /* 通知栏样式 */
    #notificationBar {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      background: #000;
      color: #fff;
      padding: 1rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 1000;
      border-radius: 4px;
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
    }
    /* 响应式设计 */
    @media (max-width: 600px) {
      .upload-section {
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
    /* 错误记录表样式 */
    .error-log {
      background: #ffe6e6;
      border: 1px solid #ffcccc;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
    }
    .error-log h3 {
      margin-top: 0;
      color: red;
    }
    .error-log ul {
      list-style: none;
      padding-left: 0;
    }
    .error-log li {
      color: red;
      margin-bottom: 0.5rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <button class="logout-btn" onclick="logout()">${isZh ? '退出登录' : 'Logout'}</button>

    <!-- 上传文件部分 -->
    <div class="upload-section">
      <h2>${isZh ? '上传文件' : 'Upload Files'}</h2>
      <div class="drag-drop" id="fileDragDropArea">
        <p>${isZh ? '将文件拖拽到此处' : 'Drag and drop files here'}</p>
        <ul class="file-list" id="fileList"></ul>
        <input type="file" id="fileInput" multiple>
        <button class="open-btn" onclick="document.getElementById('fileInput').click()">${isZh ? '选择文件' : 'Choose Files'}</button>
        <button class="upload-btn" onclick="uploadFiles()">${isZh ? '上传文件' : 'Upload Files'}</button>
      </div>
      <div class="fee-warning" id="fileFeeWarning"></div>
      <div class="progress">
        <div class="progress-bar" id="fileProgressBar"></div>
      </div>
      <div class="uploading-indicator" id="fileUploadingIndicator">
        <p>${isZh ? '正在上传文件...' : 'Uploading files...'}</p>
        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwgAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIgjI+pq+D9mDEd0dW1HUFW6XoYAOw==" alt="Uploading">
      </div>
      <div class="result" id="fileUploadResult"></div>
      <div class="error-log" id="fileErrorLog" style="display: none;">
        <h3>${isZh ? '错误记录' : 'Error Log'}</h3>
        <ul id="fileErrorList"></ul>
      </div>
    </div>

    <!-- 上传文件夹部分 -->
    <div class="upload-section">
      <h2>${isZh ? '上传文件夹' : 'Upload Folder'}</h2>
      <div class="drag-drop" id="folderDragDropArea">
        <p>${isZh ? '将文件夹拖拽到此处' : 'Drag and drop folders here'}</p>
        <ul class="file-list" id="folderFileList"></ul>
        <input type="file" id="folderInput" multiple webkitdirectory directory>
        <button class="open-btn" onclick="document.getElementById('folderInput').click()">${isZh ? '选择文件夹' : 'Choose Folder'}</button>
        <button class="upload-btn" onclick="uploadFolders()">${isZh ? '上传文件夹' : 'Upload Folders'}</button>
      </div>
      <div class="fee-warning" id="folderFeeWarning"></div>
      <div class="progress">
        <div class="progress-bar" id="folderProgressBar"></div>
      </div>
      <div class="uploading-indicator" id="folderUploadingIndicator">
        <p>${isZh ? '正在上传文件夹...' : 'Uploading folders...'}</p>
        <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwgAAAAAAACH5BAEAAAEALAAAAAAQABAAAAIgjI+pq+D9mDEd0dW1HUFW6XoYAOw==" alt="Uploading">
      </div>
      <div class="result" id="folderUploadResult"></div>
      <div class="error-log" id="folderErrorLog" style="display: none;">
        <h3>${isZh ? '错误记录' : 'Error Log'}</h3>
        <ul id="folderErrorList"></ul>
      </div>
    </div>

    <table class="file-table">
      <thead>
        <tr>
          <th>${isZh ? '文件名' : 'Filename'}</th>
          <th>${isZh ? '大小' : 'Size'}</th>
          <th>${isZh ? '存储类型' : 'Storage Type'}</th>
          <th>${isZh ? '创建时间' : 'Created At'}</th>
          <th>${isZh ? '分享链接' : 'Share Link'}</th>
          <th>${isZh ? '浏览链接' : 'View Link'}</th>
          <th>${isZh ? '嵌入链接' : 'Embed Link'}</th>
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
            <button class="copy-btn" onclick="copyLink('${file.id}', this)">${isZh ? '复制链接' : 'Copy Link'}</button>
          </td>
          <td>
            <a href="/view/${file.id}" target="_blank">${isZh ? '浏览' : 'View'}</a>
          </td>
          <td>
            <a href="/embed/${file.id}" target="_blank">${isZh ? '嵌入' : 'Embed'}</a>
          </td>
          <td>
            <button class="delete-btn" onclick="confirmDelete(this, '${file.id}')">${isZh ? '删除' : 'Delete'}</button>
          </td>
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

    // 将服务器端的 isZh 传递到客户端
    const isZh = ${isZh ? 'true' : 'false'};

    // 文件上传相关元素
    const fileDragDropArea = document.getElementById('fileDragDropArea');
    const fileInput = document.getElementById('fileInput');
    const fileList = document.getElementById('fileList');
    const fileFeeWarning = document.getElementById('fileFeeWarning');
    const fileProgressBar = document.getElementById('fileProgressBar');
    const fileProgress = fileProgressBar.parentElement;
    const fileUploadingIndicator = document.getElementById('fileUploadingIndicator');
    const fileUploadResult = document.getElementById('fileUploadResult');
    const fileErrorLog = document.getElementById('fileErrorLog');
    const fileErrorList = document.getElementById('fileErrorList');

    // 文件夹上传相关元素
    const folderDragDropArea = document.getElementById('folderDragDropArea');
    const folderInput = document.getElementById('folderInput');
    const folderFileList = document.getElementById('folderFileList');
    const folderFeeWarning = document.getElementById('folderFeeWarning');
    const folderProgressBar = document.getElementById('folderProgressBar');
    const folderProgress = folderProgressBar.parentElement;
    const folderUploadingIndicator = document.getElementById('folderUploadingIndicator');
    const folderUploadResult = document.getElementById('folderUploadResult');
    const folderErrorLog = document.getElementById('folderErrorLog');
    const folderErrorList = document.getElementById('folderErrorList');

    const notificationBar = document.getElementById('notificationBar');
    const notificationMessage = notificationBar.querySelector('.message');

    let selectedFiles = [];
    let selectedFolders = [];

    // 文件拖拽事件
    fileDragDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      fileDragDropArea.classList.add('hover');
    });

    fileDragDropArea.addEventListener('dragleave', () => {
      fileDragDropArea.classList.remove('hover');
    });

    fileDragDropArea.addEventListener('drop', async (e) => {
      e.preventDefault();
      fileDragDropArea.classList.remove('hover');
      const files = e.dataTransfer.files;
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
      }
      updateFileList();
    });

    // 文件输入变化事件
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
      }
      updateFileList();
    });

    // 文件夹拖拽事件
    folderDragDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      folderDragDropArea.classList.add('hover');
    });

    folderDragDropArea.addEventListener('dragleave', () => {
      folderDragDropArea.classList.remove('hover');
    });

    folderDragDropArea.addEventListener('drop', async (e) => {
      e.preventDefault();
      folderDragDropArea.classList.remove('hover');
      const items = e.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
          await traverseFolder(item);
        }
      }
      updateFolderList();
    });

    // 文件夹输入变化事件
    folderInput.addEventListener('change', async () => {
      const files = folderInput.files;
      for (let i = 0; i < files.length; i++) {
        selectedFolders.push(files[i]);
      }
      updateFolderList();
    });

    async function traverseFolder(item, path = '') {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            file.fullPath = path + file.name;
            selectedFolders.push(file);
            resolve();
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          dirReader.readEntries((entries) => {
            const promises = [];
            for (let i = 0; i < entries.length; i++) {
              promises.push(traverseFolder(entries[i], path + item.name + '/'));
            }
            Promise.all(promises).then(() => resolve());
          });
        }
      });
    }

    function updateFileList() {
      fileList.innerHTML = '';
      let totalSize = 0;
      selectedFiles.forEach((file) => {
        totalSize += file.size;
        const li = document.createElement('li');
        li.textContent = file.fullPath ? file.fullPath + ' (' + formatSize(file.size) + ')' : file.name + ' (' + formatSize(file.size) + ')';
        fileList.appendChild(li);
      });
      const estimatedCost = (
        (totalSize / (1024 * 1024 * 1024)) *
        0.02
      ).toFixed(2); // 假设每GB 0.02美元
      fileFeeWarning.textContent =
        isZh
          ? '预计费用：$' + estimatedCost
          : 'Estimated cost: $' + estimatedCost;
    }

    function updateFolderList() {
      folderFileList.innerHTML = '';
      let totalSize = 0;
      selectedFolders.forEach((file) => {
        totalSize += file.size;
        const li = document.createElement('li');
        li.textContent = file.fullPath ? file.fullPath + ' (' + formatSize(file.size) + ')' : file.name + ' (' + formatSize(file.size) + ')';
        folderFileList.appendChild(li);
      });
      const estimatedCost = (
        (totalSize / (1024 * 1024 * 1024)) *
        0.02
      ).toFixed(2); // 假设每GB 0.02美元
      folderFeeWarning.textContent =
        isZh
          ? '预计费用：$' + estimatedCost
          : 'Estimated cost: $' + estimatedCost;
    }

    async function uploadFiles() {
      if (selectedFiles.length === 0) return;

      fileProgress.style.display = 'block';
      fileProgressBar.style.width = '0%';
      fileUploadResult.style.display = 'none';
      fileUploadingIndicator.style.display = 'block';
      fileErrorLog.style.display = 'none';
      fileErrorList.innerHTML = '';

      const storageType = document.getElementById('storageType').value;
      let errors = [];

      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];

        // 根据文件大小选择存储方式
        let currentStorageType = storageType;
        if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
          currentStorageType = 'r2';
        }

        const formData = new FormData();
        formData.append('file', file, file.fullPath || file.name);
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
          const shareUrl = window.location.origin + '/file/' + data.id;
          const viewUrl = window.location.origin + '/view/' + data.id;
          const embedUrl = window.location.origin + '/embed/' + data.id;

          fileUploadResult.style.display = 'block';
          fileUploadResult.innerHTML += '<p>' +
            (isZh ? '文件上传成功：' : 'File uploaded successfully:') +
            ' <a href="' + shareUrl + '" target="_blank">' + data.filename + '</a> | ' +
            ' <a href="/view/' + data.id + '" target="_blank">' + (isZh ? '浏览' : 'View') + '</a> | ' + 
            ' <a href="/embed/' + data.id + '" target="_blank">' + (isZh ? '嵌入' : 'Embed') + '</a></p>';

          showNotification(
            isZh ? '文件上传成功' : 'File uploaded successfully',
            'success'
          );
        } catch (error) {
          fileUploadResult.style.display = 'block';
          fileUploadResult.innerHTML +=
            (isZh ? '上传失败: ' : 'Upload failed: ') +
            error.message +
            '<br>';
          showNotification(
            (isZh ? '上传失败: ' : 'Upload failed: ') +
              error.message,
            'error'
          );
          errors.push((isZh ? '上传失败: ' : 'Upload failed: ') + error.message);
        }

        fileProgressBar.style.width = ((i + 1) / selectedFiles.length * 100) + '%';
      }

      fileUploadingIndicator.style.display = 'none';

      if (errors.length > 0) {
        fileErrorLog.style.display = 'block';
        errors.forEach((err) => {
          const li = document.createElement('li');
          li.textContent = err;
          fileErrorList.appendChild(li);
        });
      }

      // 清空选中的文件
      selectedFiles = [];
      fileInput.value = '';
    }

    async function uploadFolders() {
      if (selectedFolders.length === 0) return;

      folderProgress.style.display = 'block';
      folderProgressBar.style.width = '0%';
      folderUploadResult.style.display = 'none';
      folderUploadingIndicator.style.display = 'block';
      folderErrorLog.style.display = 'none';
      folderErrorList.innerHTML = '';

      const storageType = document.getElementById('storageType').value;
      let errors = [];

      for (let i = 0; i < selectedFolders.length; i++) {
        const file = selectedFolders[i];

        // 根据文件大小选择存储方式
        let currentStorageType = storageType;
        if (file.size > 25 * 1024 * 1024 && currentStorageType !== 'r2') {
          currentStorageType = 'r2';
        }

        const formData = new FormData();
        formData.append('file', file, file.fullPath || file.name);
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
          const shareUrl = window.location.origin + '/file/' + data.id;
          const viewUrl = window.location.origin + '/view/' + data.id;
          const embedUrl = window.location.origin + '/embed/' + data.id;

          folderUploadResult.style.display = 'block';
          folderUploadResult.innerHTML += '<p>' +
            (isZh ? '文件夹中的文件上传成功：' : 'Files in folder uploaded successfully:') +
            ' <a href="' + shareUrl + '" target="_blank">' + data.filename + '</a> | ' +
            ' <a href="/view/' + data.id + '" target="_blank">' + (isZh ? '浏览' : 'View') + '</a> | ' + 
            ' <a href="/embed/' + data.id + '" target="_blank">' + (isZh ? '嵌入' : 'Embed') + '</a></p>';

          showNotification(
            isZh ? '文件夹中的文件上传成功' : 'Files in folder uploaded successfully',
            'success'
          );
        } catch (error) {
          folderUploadResult.style.display = 'block';
          folderUploadResult.innerHTML +=
            (isZh ? '上传失败: ' : 'Upload failed: ') +
            error.message +
            '<br>';
          showNotification(
            (isZh ? '上传失败: ' : 'Upload failed: ') +
              error.message,
            'error'
          );
          errors.push((isZh ? '上传失败: ' : 'Upload failed: ') + error.message);
        }

        folderProgressBar.style.width = ((i + 1) / selectedFolders.length * 100) + '%';
      }

      folderUploadingIndicator.style.display = 'none';

      if (errors.length > 0) {
        folderErrorLog.style.display = 'block';
        errors.forEach((err) => {
          const li = document.createElement('li');
          li.textContent = err;
          folderErrorList.appendChild(li);
        });
      }

      // 清空选中的文件夹
      selectedFolders = [];
      folderInput.value = '';
    }

    function showNotification(message, type = 'success') {
      notificationMessage.textContent = message;
      notificationBar.style.background =
        type === 'success' ? '#000' : 'red';
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
          isZh ? '确认删除' : 'Confirm Delete';
        button.dataset.confirmed = true;
        button.style.background = 'red';
        setTimeout(() => {
          button.textContent = isZh ? '删除' : 'Delete';
          delete button.dataset.confirmed;
          button.style.background = '#000';
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
            isZh ? '删除失败' : 'Failed to delete',
            'error'
          );
        }
      } catch (error) {
        showNotification(
          (isZh ? '删除失败: ' : 'Failed to delete: ') +
            error.message,
          'error'
        );
      }
    }

    function copyLink(id, button) {
      const link = window.location.origin + '/file/' + id;
      navigator.clipboard
        .writeText(link)
        .then(() => {
          showNotification(
            isZh ? '链接已复制' : 'Link copied to clipboard',
            'success'
          );
          button.textContent = isZh ? '已复制' : 'Copied';
          button.style.background = '#333';
          setTimeout(() => {
            button.textContent =
              isZh ? '复制链接' : 'Copy Link';
            button.style.background = '#000';
          }, 2000);
        })
        .catch((err) => {
          showNotification(
            isZh ? '无法复制链接' : 'Failed to copy link',
            'error'
          );
        });
    }

    function logout() {
      if (
        confirm(
          isZh
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

export const viewTemplate = (lang = 'zh', file) => {
  const isZh = lang === 'zh';

  function getMimeType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'flac': 'audio/flac',
      'epub': 'application/epub+zip',
      'pdf': 'application/pdf',
      // 添加更多类型根据需要
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  const mimeType = getMimeType(file.filename);
  let contentHtml = '';

  if (mimeType.startsWith('image/')) {
    // 图片预览
    contentHtml = `<img src="/file/${file.id}" alt="${file.filename}" style="max-width: 100%; height: auto;">`;
  } else if (mimeType.startsWith('video/')) {
    // 视频预览
    contentHtml = `
      <video controls style="max-width: 100%; height: auto;">
        <source src="/file/${file.id}" type="${mimeType}">
        ${isZh ? '您的浏览器不支持视频播放。' : 'Your browser does not support the video tag.'}
      </video>
    `;
  } else if (mimeType.startsWith('audio/')) {
    // 音频预览
    contentHtml = `
      <audio controls style="width: 100%;">
        <source src="/file/${file.id}" type="${mimeType}">
        ${isZh ? '您的浏览器不支持音频播放。' : 'Your browser does not support the audio element.'}
      </audio>
    `;
  } else if (mimeType === 'application/epub+zip') {
    // 电子书预览（简单处理，提供下载链接）
    contentHtml = `
      <p>${isZh ? '这是一个电子书文件。' : 'This is an eBook file.'}</p>
      <a href="/file/${file.id}" download="${file.filename}">${isZh ? '下载电子书' : 'Download eBook'}</a>
    `;
  } else if (mimeType === 'application/pdf') {
    // PDF预览
    contentHtml = `
      <iframe src="/file/${file.id}" style="width: 100%; height: 90vh;" frameborder="0">
        ${isZh ? '您的浏览器不支持PDF预览。' : 'Your browser does not support PDF previews.'}
      </iframe>
    `;
  } else {
    // 其他类型，提供下载链接
    contentHtml = `
      <p>${isZh ? '无法预览此文件类型。' : 'Cannot preview this file type.'}</p>
      <a href="/file/${file.id}" download="${file.filename}">${isZh ? '下载文件' : 'Download File'}</a>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '浏览文件' : 'View File'}</title>
  <style>
    body { margin: 0; padding: 20px; background: #fff; color: #000; }
    .container { position: relative; max-width: 1000px; margin: 0 auto; }
    .download-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      background: #000;
      color: #fff;
      border: none;
      padding: 10px 20px;
      cursor: pointer;
      border-radius: 4px;
    }
    .download-btn:hover { background: #333; }
  </style>
</head>
<body>
  <div class="container">
    <button class="download-btn" onclick="downloadFile()">${isZh ? '下载' : 'Download'}</button>
    ${contentHtml}
  </div>
  <script>
    function downloadFile() {
      window.location.href = '/file/${file.id}';
    }
  </script>
</body>
</html>
`;
};

export const embedTemplate = (lang = 'zh', file) => {
  const isZh = lang === 'zh';

  function getMimeType(filename) {
    const extension = filename.split('.').pop().toLowerCase();
    const mimeTypes = {
      'png': 'image/png',
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'gif': 'image/gif',
      'bmp': 'image/bmp',
      'webp': 'image/webp',
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mp3': 'audio/mpeg',
      'wav': 'audio/wav',
      'flac': 'audio/flac',
      'epub': 'application/epub+zip',
      'pdf': 'application/pdf',
      // 添加更多类型根据需要
    };
    return mimeTypes[extension] || 'application/octet-stream';
  }

  const mimeType = getMimeType(file.filename);
  let contentHtml = '';

  if (mimeType.startsWith('image/')) {
    // 图片预览
    contentHtml = `<img src="/file/${file.id}" alt="${file.filename}" style="max-width: 100%; height: auto;">`;
  } else if (mimeType.startsWith('video/')) {
    // 视频预览
    contentHtml = `
      <video controls style="max-width: 100%; height: auto;">
        <source src="/file/${file.id}" type="${mimeType}">
        ${isZh ? '您的浏览器不支持视频播放。' : 'Your browser does not support the video tag.'}
      </video>
    `;
  } else if (mimeType.startsWith('audio/')) {
    // 音频预览
    contentHtml = `
      <audio controls style="width: 100%;">
        <source src="/file/${file.id}" type="${mimeType}">
        ${isZh ? '您的浏览器不支持音频播放。' : 'Your browser does not support the audio element.'}
      </audio>
    `;
  } else if (mimeType === 'application/epub+zip') {
    // 电子书预览（简单处理，提供下载链接）
    contentHtml = `
      <p>${isZh ? '这是一个电子书文件。' : 'This is an eBook file.'}</p>
      <a href="/file/${file.id}" download="${file.filename}">${isZh ? '下载电子书' : 'Download eBook'}</a>
    `;
  } else if (mimeType === 'application/pdf') {
    // PDF预览
    contentHtml = `
      <iframe src="/file/${file.id}" style="width: 100%; height: 90vh;" frameborder="0">
        ${isZh ? '您的浏览器不支持PDF预览。' : 'Your browser does not support PDF previews.'}
      </iframe>
    `;
  } else {
    // 其他类型，提供下载链接
    contentHtml = `
      <p>${isZh ? '无法预览此文件类型。' : 'Cannot preview this file type.'}</p>
      <a href="/file/${file.id}" download="${file.filename}">${isZh ? '下载文件' : 'Download File'}</a>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '嵌入文件' : 'Embed File'}</title>
  <style>
    body { margin: 0; padding: 0; background: transparent; color: #000; }
    .container { max-width: 100%; margin: 0 auto; }
  </style>
</head>
<body>
  <div class="container">
    ${contentHtml}
  </div>
</body>
</html>
`;
};
