// src/html/templates.js

/**
 * 登录页面模板
 * @param {string} lang - 语言代码（'zh' 或 'en'）
 * @param {object} settings - 主题设置
 * @returns {string} HTML字符串
 */
export const loginTemplate = (lang = 'zh', settings = {}) => {
  const isZh = lang === 'zh';

  // 应用主题设置
  const themeStyles = `
    :root {
      --background-color: ${settings.backgroundColor || '#fff'};
      --text-color: ${settings.textColor || '#000'};
      --button-color: ${settings.buttonColor || '#000'};
      --button-text-color: ${settings.buttonTextColor || '#fff'};
      --header-background: ${settings.headerBackground || 'rgba(255, 255, 255, 0.5)'};
      --header-text-color: ${settings.headerTextColor || '#000'};
    }
  `;

  // 设置背景图片
  const backgroundImageStyle = settings.backgroundImage
    ? `background-image: url('${settings.backgroundImage}'); background-size: cover;`
    : '';

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '登录' : 'Login'}</title>
  <style>
    ${themeStyles}
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--background-color);
      color: var(--text-color);
      ${backgroundImageStyle}
      transition: background 0.3s, color 0.3s;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
    }
    .login-container {
      background: rgba(255, 255, 255, 0.8);
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      width: 300px;
      text-align: center;
    }
    .login-container h2 {
      margin-bottom: 1.5rem;
      color: var(--header-text-color);
    }
    .login-container input {
      width: 100%;
      padding: 10px;
      margin-bottom: 1rem;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .login-container button {
      width: 100%;
      padding: 10px;
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 16px;
    }
    .login-container button:hover {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="login-container">
    <h2>${isZh ? '登录' : 'Login'}</h2>
    <form action="/login" method="POST">
      <input type="text" name="username" placeholder="${isZh ? '用户名' : 'Username'}" required>
      <input type="password" name="password" placeholder="${isZh ? '密码' : 'Password'}" required>
      <button type="submit">${isZh ? '登录' : 'Login'}</button>
    </form>
  </div>
</body>
</html>
`;
};

/**
 * 主页面模板
 * @param {string} lang - 语言代码（'zh' 或 'en'）
 * @param {Array} files - 文件列表
 * @param {object} settings - 主题设置
 * @returns {string} HTML字符串
 */
export const mainTemplate = (lang = 'zh', files = [], settings = {}) => {
  const isZh = lang === 'zh';

  // 确保 files 是一个数组
  const safeFiles = Array.isArray(files) ? files : [];

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }

  // 应用主题设置
  const themeStyles = `
    :root {
      --background-color: ${settings.backgroundColor || '#fff'};
      --text-color: ${settings.textColor || '#000'};
      --button-color: ${settings.buttonColor || '#000'};
      --button-text-color: ${settings.buttonTextColor || '#fff'};
      --header-background: ${settings.headerBackground || 'rgba(255, 255, 255, 0.5)'};
      --header-text-color: ${settings.headerTextColor || '#000'};
    }
  `;

  // 设置背景图片
  const backgroundImageStyle = settings.backgroundImage
    ? `background-image: url('${settings.backgroundImage}'); background-size: cover;`
    : '';

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '文件分享' : 'File Share'}</title>
  <style>
    ${themeStyles}
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--background-color);
      color: var(--text-color);
      ${backgroundImageStyle}
      transition: background 0.3s, color 0.3s;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      position: relative;
    }
    .header {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-bottom: 20px;
    }
    .logout-btn, .settings-btn {
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      padding: 10px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
    }
    .logout-btn:hover, .settings-btn:hover {
      background: #333;
    }
    .upload-section {
      background: var(--header-background);
      backdrop-filter: blur(10px);
      padding: 2rem;
      border-radius: 8px;
      border: 1px solid #ccc;
      margin-bottom: 2rem;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: background 0.3s, border 0.3s;
    }
    .upload-section h2 {
      text-align: center;
      margin-bottom: 1.5rem;
      color: var(--header-text-color);
    }
    .upload-buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
    }
    .upload-buttons button {
      flex: 1;
      min-width: 150px;
      padding: 10px 20px;
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 16px;
    }
    .upload-buttons button:hover {
      background: #333;
    }
    .drag-drop {
      border: 2px dashed #ccc;
      padding: 2rem;
      text-align: center;
      transition: background 0.3s;
      border-radius: 8px;
      background: var(--background-color);
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      min-height: 150px;
      color: var(--text-color);
    }
    .drag-drop.hover {
      background: #f9f9f9;
    }
    .drag-drop p {
      margin: 0;
      font-size: 18px;
      color: var(--text-color);
    }
    .file-list {
      list-style: none;
      padding: 0;
      width: 100%;
      max-height: 150px;
      overflow-y: auto;
      margin-top: 1rem;
      text-align: left;
    }
    .file-list li {
      margin-bottom: 0.5rem;
      color: var(--text-color);
      word-break: break-all;
    }
    .fee-warning {
      margin-top: 1rem;
      color: #666;
      font-size: 0.9rem;
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
      background: var(--button-color);
      width: 0%;
      transition: width 0.3s;
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
    .result {
      margin-top: 1rem;
      padding: 1rem;
      background: #f8f8f8;
      border-radius: 4px;
      display: none;
      word-break: break-all;
    }
    .error-log {
      background: #ffe6e6;
      border: 1px solid #ffcccc;
      padding: 1rem;
      border-radius: 4px;
      margin-top: 1rem;
      display: none;
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
      word-break: break-all;
    }
    table.file-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 2rem;
      background: var(--background-color);
      border: 1px solid #ccc;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      transition: background 0.3s, border 0.3s;
    }
    table.file-table th, table.file-table td {
      border-bottom: 1px solid #ddd;
      padding: 12px;
      text-align: left;
      color: var(--text-color);
    }
    table.file-table th {
      background: #f9f9f9;
      color: var(--text-color);
    }
    table.file-table tr:last-child td {
      border-bottom: none;
    }
    .delete-btn, .copy-btn, .embed-btn {
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      margin-right: 5px;
      font-size: 14px;
    }
    .delete-btn:hover {
      background: red;
    }
    .copy-btn:hover {
      background: #333;
    }
    .embed-btn:hover {
      background: #333;
    }
    /* 通知栏样式 */
    #notificationBar {
      position: fixed;
      bottom: -100px;
      left: 50%;
      transform: translateX(-50%);
      width: 90%;
      max-width: 800px;
      background: var(--button-color);
      color: var(--button-text-color);
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
      color: var(--button-text-color);
      font-size: 1.5rem;
      cursor: pointer;
    }
    /* 侧边栏样式 */
    .sidebar {
      position: fixed;
      top: 0;
      right: -300px;
      width: 300px;
      height: 100%;
      background: rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
      box-shadow: -2px 0 5px rgba(0,0,0,0.1);
      padding: 20px;
      transition: right 0.3s ease-in-out;
      z-index: 1001;
      color: var(--text-color);
    }
    .sidebar.active {
      right: 0;
    }
    .sidebar h2 {
      margin-top: 0;
      text-align: center;
    }
    .sidebar .close-sidebar {
      position: absolute;
      top: 10px;
      left: 10px;
      background: none;
      border: none;
      font-size: 1.5rem;
      cursor: pointer;
      color: var(--text-color);
    }
    .sidebar .section {
      margin-bottom: 20px;
    }
    .sidebar label {
      display: block;
      margin-bottom: 5px;
    }
    .sidebar input[type="color"], .sidebar input[type="text"] {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .sidebar select {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
    .sidebar button {
      width: 100%;
      padding: 10px;
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 16px;
    }
    .sidebar button:hover {
      background: #333;
    }
    /* 响应式设计 */
    @media (max-width: 600px) {
      .upload-buttons {
        flex-direction: column;
        gap: 0.5rem;
      }
      .upload-buttons button {
        width: 100%;
      }
      .logout-btn, .settings-btn {
        padding: 5px 10px;
        font-size: 14px;
      }
      .sidebar {
        width: 100%;
        right: -100%;
      }
      .sidebar.active {
        right: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <button class="settings-btn" onclick="openSidebar()">${isZh ? '设置' : 'Settings'}</button>
      <button class="logout-btn" onclick="confirmLogout(this)">${isZh ? '退出登录' : 'Logout'}</button>
    </div>

    <!-- 上传部分 -->
    <div class="upload-section">
      <h2>${isZh ? '上传文件' : 'Upload Files'}</h2>
      <div class="upload-buttons">
        <button class="upload-btn" onclick="triggerFileUpload()">${isZh ? '上传文件' : 'Upload Files'}</button>
        <button class="upload-btn" onclick="triggerFolderUpload()">${isZh ? '上传文件夹' : 'Upload Folders'}</button>
      </div>
      <!-- 文件上传隐藏输入 -->
      <input type="file" id="fileInput" multiple style="display: none;">
      <!-- 文件夹上传隐藏输入 -->
      <input type="file" id="folderInput" multiple webkitdirectory directory style="display: none;">
      <!-- 拖拽区域 -->
      <div class="drag-drop" id="dragDropArea">
        <p>${isZh ? '将文件或文件夹拖拽到此处' : 'Drag and drop files or folders here'}</p>
        <ul class="file-list" id="fileList"></ul>
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
      <div class="error-log" id="errorLog" style="display: none;">
        <h3>${isZh ? '错误记录' : 'Error Log'}</h3>
        <ul id="errorList"></ul>
      </div>
    </div>

    <!-- 文件列表表格 -->
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
        ${safeFiles.map(
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
        ).join('')}
      </tbody>
    </table>
  </div>

  <!-- 侧边栏 -->
  <div class="sidebar" id="sidebar">
    <button class="close-sidebar" onclick="closeSidebar()">×</button>
    <h2>${isZh ? '设置' : 'Settings'}</h2>
  
    <!-- 主题模式选择 -->
    <div class="section">
      <label for="themeSelect">${isZh ? '主题模式' : 'Theme Mode'}</label>
      <select id="themeSelect" onchange="changeTheme(this.value)">
        <option value="default" ${settings.theme === 'default' ? 'selected' : ''}>${isZh ? '默认模式' : 'Default Mode'}</option>
        <option value="dark" ${settings.theme === 'dark' ? 'selected' : ''}>${isZh ? '暗色模式' : 'Dark Mode'}</option>
        <option value="art" ${settings.theme === 'art' ? 'selected' : ''}>${isZh ? '艺术模式' : 'Art Mode'}</option>
      </select>
    </div>

    <!-- 自定义主题 -->
    <div class="section">
      <label for="backgroundColor">${isZh ? '背景颜色' : 'Background Color'}</label>
      <input type="color" id="backgroundColor" value="${settings.backgroundColor || '#ffffff'}" onchange="updateThemeColor('backgroundColor', this.value)">
    
      <label for="textColor">${isZh ? '文字颜色' : 'Text Color'}</label>
      <input type="color" id="textColor" value="${settings.textColor || '#000000'}" onchange="updateThemeColor('textColor', this.value)">
    
      <label for="buttonColor">${isZh ? '按钮颜色' : 'Button Color'}</label>
      <input type="color" id="buttonColor" value="${settings.buttonColor || '#000000'}" onchange="updateThemeColor('buttonColor', this.value)">
    
      <label for="buttonTextColor">${isZh ? '按钮文字颜色' : 'Button Text Color'}</label>
      <input type="color" id="buttonTextColor" value="${settings.buttonTextColor || '#ffffff'}" onchange="updateThemeColor('buttonTextColor', this.value)">
    
      <label for="headerBackground">${isZh ? '头部背景' : 'Header Background'}</label>
      <input type="color" id="headerBackground" value="${settings.headerBackground || 'rgba(255, 255, 255, 0.5)'}" onchange="updateThemeColor('headerBackground', this.value)">
    
      <label for="headerTextColor">${isZh ? '头部文字颜色' : 'Header Text Color'}</label>
      <input type="color" id="headerTextColor" value="${settings.headerTextColor || '#000000'}" onchange="updateThemeColor('headerTextColor', this.value)">
    
      <label for="backgroundImage">${isZh ? '背景图片 URL' : 'Background Image URL'}</label>
      <input type="text" id="backgroundImage" placeholder="${isZh ? '请输入图片链接' : 'Enter image URL'}" value="${settings.backgroundImage || ''}" onchange="updateThemeImage(this.value)">
    </div>

    <!-- 语言切换 -->
    <div class="section">
      <label for="languageSelect">${isZh ? '语言' : 'Language'}</label>
      <select id="languageSelect" onchange="changeLanguage(this.value)">
        <option value="zh" ${lang === 'zh' ? 'selected' : ''}>中文</option>
        <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
      </select>
    </div>

    <button onclick="saveSettings()">${isZh ? '保存设置' : 'Save Settings'}</button>
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

    // 将服务器端的 isZh 和 settings 传递到客户端
    const isZh = ${isZh ? 'true' : 'false'};
    const initialSettings = ${JSON.stringify(settings)};
    const initialLang = '${lang}';

    // 上传相关元素
    const dragDropArea = document.getElementById('dragDropArea');
    const fileInput = document.getElementById('fileInput');
    const folderInput = document.getElementById('folderInput');
    const fileList = document.getElementById('fileList');
    const feeWarning = document.getElementById('feeWarning');
    const progressBar = document.getElementById('progressBar');
    const progress = document.querySelector('.progress');
    const uploadResult = document.getElementById('uploadResult');
    const uploadingIndicator = document.getElementById('uploadingIndicator');
    const errorLog = document.getElementById('errorLog');
    const errorList = document.getElementById('errorList');
    const notificationBar = document.getElementById('notificationBar');
    const notificationMessage = notificationBar.querySelector('.message');
    const sidebar = document.getElementById('sidebar');
    const themeSelect = document.getElementById('themeSelect');
    const languageSelect = document.getElementById('languageSelect');

    let selectedFiles = [];
    let currentSettings = {...initialSettings}; // 深拷贝设置

    // 上传按钮事件
    function triggerFileUpload() {
      fileInput.click();
    }

    function triggerFolderUpload() {
      folderInput.click();
    }

    // 文件拖拽事件
    dragDropArea.addEventListener('dragover', (e) => {
      e.preventDefault();
      dragDropArea.classList.add('hover');
    });

    dragDropArea.addEventListener('dragleave', () => {
      dragDropArea.classList.remove('hover');
    });

    dragDropArea.addEventListener('drop', async (e) => {
      e.preventDefault();
      dragDropArea.classList.remove('hover');
      const items = e.dataTransfer.items;
      for (let i = 0; i < items.length; i++) {
        const item = items[i].webkitGetAsEntry();
        if (item) {
          await traverseFileTree(item);
        }
      }
      updateFileList();
      uploadFiles(); // 自动开始上传
    });

    // 文件输入变化事件
    fileInput.addEventListener('change', () => {
      const files = fileInput.files;
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
      }
      updateFileList();
      uploadFiles(); // 自动开始上传
    });

    // 文件夹输入变化事件
    folderInput.addEventListener('change', async () => {
      const files = folderInput.files;
      for (let i = 0; i < files.length; i++) {
        selectedFiles.push(files[i]);
      }
      updateFileList();
      uploadFiles(); // 自动开始上传
    });

    async function traverseFileTree(item, path = '') {
      return new Promise((resolve) => {
        if (item.isFile) {
          item.file((file) => {
            file.fullPath = path + file.name;
            selectedFiles.push(file);
            resolve();
          });
        } else if (item.isDirectory) {
          const dirReader = item.createReader();
          dirReader.readEntries((entries) => {
            const promises = [];
            for (let i = 0; i < entries.length; i++) {
              promises.push(traverseFileTree(entries[i], path + item.name + '/'));
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
      feeWarning.textContent =
        isZh
          ? '预计费用：$' + estimatedCost
          : 'Estimated cost: $' + estimatedCost;
    }

    async function uploadFiles() {
      if (selectedFiles.length === 0) return;

      progress.style.display = 'block';
      progressBar.style.width = '0%';
      uploadResult.style.display = 'none';
      uploadingIndicator.style.display = 'block';
      errorLog.style.display = 'none';
      errorList.innerHTML = '';

      const storageType = 'd1'; // 默认存储类型
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
          data.results.forEach((result) => {
            const shareUrl = window.location.origin + '/file/' + result.id;
            const viewUrl = window.location.origin + '/view/' + result.id;
            const embedUrl = window.location.origin + '/embed/' + result.id;

            uploadResult.style.display = 'block';
            uploadResult.innerHTML += '<p>' +
              (isZh ? '文件上传成功：' : 'File uploaded successfully:') +
              ' <a href="' + shareUrl + '" target="_blank">' + result.filename + '</a> | ' +
              ' <a href="/view/' + result.id + '" target="_blank">' + (isZh ? '浏览' : 'View') + '</a> | ' + 
              ' <a href="/embed/' + result.id + '" target="_blank">' + (isZh ? '嵌入' : 'Embed') + '</a></p>';
          });

          if (data.results.length > 0) {
            showNotification(
              isZh ? '文件上传成功' : 'File uploaded successfully',
              'success'
            );
          }

          if (data.errors && data.errors.length > 0) {
            data.errors.forEach((err) => {
              uploadResult.style.display = 'block';
              uploadResult.innerHTML +=
                (isZh ? '上传失败: ' : 'Upload failed: ') +
                err.filename + ' - ' + err.message +
                '<br>';
              showNotification(
                (isZh ? '上传失败: ' : 'Upload failed: ') +
                  err.filename + ' - ' + err.message,
                'error'
              );
              errors.push((isZh ? '上传失败: ' : 'Upload failed: ') + err.filename + ' - ' + err.message);
            });
          }
        } catch (error) {
          uploadResult.style.display = 'block';
          uploadResult.innerHTML +=
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

        progressBar.style.width = ((i + 1) / selectedFiles.length * 100) + '%';
      }

      uploadingIndicator.style.display = 'none';

      if (errors.length > 0) {
        errorLog.style.display = 'block';
        errors.forEach((err) => {
          const li = document.createElement('li');
          li.textContent = err;
          errorList.appendChild(li);
        });
      }

      // 清空选中的文件
      selectedFiles = [];
      fileInput.value = '';
      folderInput.value = '';
    }

    function showNotification(message, type = 'success') {
      notificationMessage.textContent = message;
      notificationBar.style.background =
        type === 'success' ? 'var(--button-color)' : 'red';
      notificationBar.style.color =
        type === 'success' ? 'var(--button-text-color)' : '#fff';
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
        button.classList.add('confirm');
        setTimeout(() => {
          button.textContent = isZh ? '删除' : 'Delete';
          delete button.dataset.confirmed;
          button.classList.remove('confirm');
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
            button.style.background = 'var(--button-color)';
          }, 2000);
        })
        .catch((err) => {
          showNotification(
            isZh ? '无法复制链接' : 'Failed to copy link',
            'error'
          );
        });
    }

    function confirmLogout(button) {
      if (button.dataset.confirmed) {
        // 执行登出
        logout();
      } else {
        button.textContent =
          isZh ? '确认退出登录' : 'Confirm Logout';
        button.dataset.confirmed = true;
        button.classList.add('confirm');
        button.style.background = 'red';
        setTimeout(() => {
          button.textContent = isZh ? '退出登录' : 'Logout';
          delete button.dataset.confirmed;
          button.style.background = 'var(--button-color)';
          button.classList.remove('confirm');
        }, 3000); // 3 秒后重置按钮
      }
    }

    function logout() {
      fetch('/logout', {
        method: 'POST',
      }).then(() => {
        window.location.href = '/auth';
      }).catch((error) => {
        showNotification(
          isZh ? '退出登录失败' : 'Failed to logout',
          'error'
        );
      });
    }

    // 侧边栏控制
    function openSidebar() {
      sidebar.classList.add('active');
    }

    function closeSidebar() {
      sidebar.classList.remove('active');
    }

    // 主题切换
    function changeTheme(theme) {
      currentSettings.theme = theme;
      applyTheme();
    }

    function updateThemeColor(colorProperty, value) {
      currentSettings[colorProperty] = value;
      applyTheme();
    }

    function updateThemeImage(url) {
      currentSettings.backgroundImage = url;
      applyTheme();
    }

    function applyTheme() {
      const root = document.documentElement;
      root.style.setProperty('--background-color', currentSettings.backgroundColor || '#fff');
      root.style.setProperty('--text-color', currentSettings.textColor || '#000');
      root.style.setProperty('--button-color', currentSettings.buttonColor || '#000');
      root.style.setProperty('--button-text-color', currentSettings.buttonTextColor || '#fff');
      root.style.setProperty('--header-background', currentSettings.headerBackground || 'rgba(255, 255, 255, 0.5)');
      root.style.setProperty('--header-text-color', currentSettings.headerTextColor || '#000');

      // 设置背景图片
      document.body.style.backgroundImage = currentSettings.backgroundImage ? \`url('\${currentSettings.backgroundImage}')\` : '';
    }

    // 语言切换
    function changeLanguage(lang) {
      currentSettings.language = lang;
      applyLanguage(lang);
      saveSettings(); // 保存语言设置
    }

    function applyLanguage(lang) {
      // 重新加载页面以应用语言更改
      window.location.href = '/?lang=' + lang;
    }

    // 打开侧边栏时加载当前设置
    window.onload = function() {
      if (initialSettings) {
        applyTheme();
        if (initialSettings.language) {
          languageSelect.value = initialSettings.language;
        }
      }
    }

    // 保存设置
    async function saveSettings() {
      try {
        const response = await fetch('/settings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(currentSettings)
        });

        if (response.ok) {
          showNotification(
            isZh ? '设置已保存' : 'Settings saved',
            'success'
          );
          closeSidebar();
        } else {
          const errorData = await response.json();
          showNotification(
            isZh ? \`保存失败: \${errorData.error}\` : \`Save failed: \${errorData.error}\`,
            'error'
          );
        }
      } catch (error) {
        showNotification(
          isZh ? \`保存失败: \${error.message}\` : \`Save failed: \${error.message}\`,
          'error'
        );
      }
    }
  </script>
</body>
</html>
`;
};

/**
 * 查看文件详情页面模板
 * @param {string} lang - 语言代码（'zh' 或 'en'）
 * @param {object} file - 文件信息对象
 * @param {object} settings - 主题设置
 * @returns {string} HTML字符串
 */
export const viewTemplate = (lang = 'zh', file = {}, settings = {}) => {
  const isZh = lang === 'zh';

  function formatSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    return (bytes / 1073741824).toFixed(2) + ' GB';
  }

  // 应用主题设置
  const themeStyles = `
    :root {
      --background-color: ${settings.backgroundColor || '#fff'};
      --text-color: ${settings.textColor || '#000'};
      --button-color: ${settings.buttonColor || '#000'};
      --button-text-color: ${settings.buttonTextColor || '#fff'};
      --header-background: ${settings.headerBackground || 'rgba(255, 255, 255, 0.5)'};
      --header-text-color: ${settings.headerTextColor || '#000'};
    }
  `;

  // 设置背景图片
  const backgroundImageStyle = settings.backgroundImage
    ? `background-image: url('${settings.backgroundImage}'); background-size: cover;`
    : '';

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '查看文件' : 'View File'}</title>
  <style>
    ${themeStyles}
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--background-color);
      color: var(--text-color);
      ${backgroundImageStyle}
      transition: background 0.3s, color 0.3s;
    }
    .file-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .file-container h2 {
      margin-bottom: 1.5rem;
      color: var(--header-text-color);
    }
    .file-container p {
      margin: 0.5rem 0;
      font-size: 1.1rem;
    }
    .file-container a {
      display: inline-block;
      margin-top: 1rem;
      padding: 10px 20px;
      background: var(--button-color);
      color: var(--button-text-color);
      text-decoration: none;
      border-radius: 4px;
      transition: background 0.3s;
    }
    .file-container a:hover {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="file-container">
    <h2>${isZh ? '文件详情' : 'File Details'}</h2>
    <p><strong>${isZh ? '文件名' : 'Filename'}:</strong> ${file.filename}</p>
    <p><strong>${isZh ? '大小' : 'Size'}:</strong> ${formatSize(file.size)}</p>
    <p><strong>${isZh ? '存储类型' : 'Storage Type'}:</strong> ${file.storage_type.toUpperCase()}</p>
    <p><strong>${isZh ? '创建时间' : 'Created At'}:</strong> ${new Date(file.created_at).toLocaleString(isZh ? 'zh-CN' : 'en-US')}</p>
    <a href="/download/${file.id}" target="_blank">${isZh ? '下载文件' : 'Download File'}</a>
  </div>
</body>
</html>
`;
};

/**
 * 嵌入文件页面模板
 * @param {string} lang - 语言代码（'zh' 或 'en'）
 * @param {object} file - 文件信息对象
 * @param {object} settings - 主题设置
 * @returns {string} HTML字符串
 */
export const embedTemplate = (lang = 'zh', file = {}, settings = {}) => {
  const isZh = lang === 'zh';

  // 应用主题设置
  const themeStyles = `
    :root {
      --background-color: ${settings.backgroundColor || '#fff'};
      --text-color: ${settings.textColor || '#000'};
      --button-color: ${settings.buttonColor || '#000'};
      --button-text-color: ${settings.buttonTextColor || '#fff'};
      --header-background: ${settings.headerBackground || 'rgba(255, 255, 255, 0.5)'};
      --header-text-color: ${settings.headerTextColor || '#000'};
    }
  `;

  // 设置背景图片
  const backgroundImageStyle = settings.backgroundImage
    ? `background-image: url('${settings.backgroundImage}'); background-size: cover;`
    : '';

  return `
<!DOCTYPE html>
<html lang="${isZh ? 'zh' : 'en'}">
<head>
  <meta charset="UTF-8">
  <title>${isZh ? '嵌入文件' : 'Embed File'}</title>
  <style>
    ${themeStyles}
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      margin: 0;
      padding: 20px;
      background: var(--background-color);
      color: var(--text-color);
      ${backgroundImageStyle}
      transition: background 0.3s, color 0.3s;
    }
    .embed-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: rgba(255, 255, 255, 0.8);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      text-align: center;
    }
    .embed-container h2 {
      margin-bottom: 1.5rem;
      color: var(--header-text-color);
    }
    .embed-container textarea {
      width: 100%;
      height: 150px;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      resize: none;
      font-family: monospace;
      font-size: 14px;
    }
    .embed-container button {
      margin-top: 1rem;
      padding: 10px 20px;
      background: var(--button-color);
      color: var(--button-text-color);
      border: none;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.3s;
      font-size: 16px;
    }
    .embed-container button:hover {
      background: #333;
    }
  </style>
</head>
<body>
  <div class="embed-container">
    <h2>${isZh ? '嵌入文件' : 'Embed File'}</h2>
    <textarea readonly onclick="this.select()">${window.location.origin}/embed/${file.id}</textarea>
    <button onclick="copyEmbedCode()">${isZh ? '复制代码' : 'Copy Code'}</button>
  </div>
  
  <script>
    function copyEmbedCode() {
      const textarea = document.querySelector('.embed-container textarea');
      textarea.select();
      document.execCommand('copy');
      alert('${isZh ? '代码已复制到剪贴板' : 'Embed code copied to clipboard'}');
    }
  </script>
</body>
</html>
`;
};
