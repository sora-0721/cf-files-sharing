# CloudFlare File Share

一个运行在 Cloudflare Workers 上的简洁文件分享工具，支持 R2 和 D1 双存储方案。

## 特性

- 🔐 密码保护，支持 Cookie 持久化登录（30天）
- 💾 双存储方案：R2 储存桶 + D1 数据库
- 📦 自动存储选择：>25MB 文件自动使用 R2
- 🔗 简洁的分享链接
- 🎨 极简黑白界面设计
- 🚀 Cloudflare Workers 驱动，全球极速访问

## 在线演示

访问：`your-worker-subdomain.workers.dev`

## 部署指南

### 前置要求

- [Node.js](https://nodejs.org/) (16.x 或更高版本)
- [Cloudflare 账号](https://dash.cloudflare.com/sign-up)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### 步骤 1: 配置环境

1. 克隆仓库：
```bash
git clone https://github.com/your-username/cloudflare-file-share.git
cd cloudflare-file-share
```

2. 安装依赖：
```bash
npm install
```

3. 登录到 Cloudflare：
```bash
wrangler login
```

### 步骤 2: 创建必要的 Cloudflare 资源

1. 创建 R2 储存桶：
```bash
wrangler r2 bucket create file-share
```

2. 创建 D1 数据库：
```bash
wrangler d1 create file-share
```

3. 更新 `wrangler.toml` 文件中的数据库 ID：
```toml
[[d1_databases]]
binding = "DB"
database_name = "file_share"
database_id = "你的数据库ID" # 从上一步获取
```

### 步骤 3: 配置环境变量

1. 设置认证密码：
```bash
wrangler secret put AUTH_PASSWORD
```
在提示时输入你想要设置的密码。

### 步骤 4: 初始化数据库

运行数据库迁移：
```bash
wrangler d1 execute file-share --file=./migrations/init.sql
```

### 步骤 5: 部署

部署到 Cloudflare Workers：
```bash
wrangler deploy
```

## 使用指南

### 管理员访问

1. 访问你的 Workers 域名
2. 输入设置的 AUTH_PASSWORD 密码登录
3. 登录状态将保持 30 天

### 文件上传

1. 登录后，选择要上传的文件
2. 对于小于 25MB 的文件，可以选择存储方式（R2 或 D1）
3. 大于 25MB 的文件将自动使用 R2 存储
4. 上传完成后获取分享链接

### 文件分享

- 分享链接格式：`https://your-worker.workers.dev/file/[FILE_ID]`
- 任何人都可以通过链接直接下载文件
- 链接永久有效

## 技术细节

### 存储机制

- **R2 存储**：适用于大文件，无大小限制
- **D1 存储**：适用于小文件（<25MB），存储在 SQLite 数据库中

### 数据库结构

```sql
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content BLOB
);
```

### 安全特性

- 密码保护的管理界面
- HttpOnly Cookie
- 安全的文件 ID 生成机制

## 配置选项

### 环境变量

| 变量名 | 描述 | 必需 |
|--------|------|------|
| AUTH_PASSWORD | 管理界面登录密码 | 是 |

### wrangler.toml 配置

```toml
name = "file-share-worker"
main = "src/index.js"

[[r2_buckets]]
binding = "FILE_BUCKET"
bucket_name = "file-share"

[[d1_databases]]
binding = "DB"
database_name = "file_share"
database_id = "your-database-id"
```

## 开发指南

### 本地开发

1. 克隆仓库后运行：
```bash
wrangler dev
```

2. 访问 `http://localhost:8787` 进行测试

### 代码结构

```
file-share-worker/
├── src/
│   ├── index.js        # 主入口文件
│   ├── auth.js         # 认证相关逻辑
│   ├── storage/
│   │   ├── r2.js       # R2存储处理
│   │   └── d1.js       # D1存储处理
│   │   └── manager.js  # 存储管理器
│   ├── utils/
│   │   ├── response.js # 响应处理工具
│   │   └── id.js       # 文件ID生成器
│   └── html/
│       └── templates.js # HTML模板
├── wrangler.toml       # Cloudflare配置
└── migrations/         # D1数据库迁移
    └── init.sql
```

## 贡献指南

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的改动 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开一个 Pull Request

## 致谢

- Cloudflare Workers 平台
- Claude-3.5-Sonnet AI

## 问题反馈

如果你发现任何问题或有改进建议，请创建一个 [issue](https://github.com/your-username/cloudflare-file-share/issues)。

