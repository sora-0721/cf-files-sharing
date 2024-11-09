# CloudFlare File Share
English｜[简体中文](https://github.com/joyance-professional/cf-files-sharing/blob/main/README-cn.md)

A simple file sharing tool running on Cloudflare Workers, supporting R2 and D1 dual storage solutions.

## Features

- 🔐 Password protection, support Cookie persistent login (30 days)
- 💾 Dual storage solution: R2 storage bucket + D1 database
- 📦 Automatic storage selection: >25MB files automatically use R2
- 🔗 Simple sharing link
- 🎨 Minimalist black and white interface design
- 🚀 Cloudflare Workers driven, global high-speed access

## Logic
```
Login process:
User access → Check cookies → No cookies → Display login page → Verify password → Set cookies → Enter home page
→ There are cookies → Verify cookies → Enter home page

Upload process:
Select file → Check file size → >25MB → Use R2 storage
→ ≤25MB → Select storage method → ​​R2 or D1
→ Generate unique ID → Store file → Return to the shared link

Download process:
Access the shared link → Parse the file ID → Determine the storage location → Get the file → Return the file content
```

## Deployment Guide

### Prerequisites

- [Node.js](https://nodejs.org/) (16.x or higher)

- [Cloudflare account](https://dash.cloudflare.com/sign-up)

- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/)

### Step 1: Configure the environment

1. Clone the repository:
```bash
git clone https://github.com/joyance-professional/cf-files-sharing
cd cloudflare-file-share
```

2. Install dependencies:
```bash
npm install
```

3. Log in to Cloudflare:
```bash
wrangler login
```

### Step 2: Create the necessary Cloudflare resources

1. Create the R2 bucket:
```bash
wrangler r2 bucket create file-share
```

2. Create the D1 database:
```bash
wrangler d1 create file-share
```

3. Update the database ID in the `wrangler.toml` file:
```toml
[[d1_databases]]
binding = "DB"
database_name = "file_share"
database_id = "your database ID" # obtained from the previous step
```

### Step 3: Configure environment variables

1. Set the authentication password:
```bash
wrangler secret put AUTH_PASSWORD
```
When prompted, enter the password you want to set.

### Step 4: Initialize the database

Run database migrations:
```bash
wrangler d1 execute file-share --file=./migrations/init.sql
```

### Step 5: Deploy

Deploy to Cloudflare Workers:
```bash
wrangler deploy
```

## Usage Guide

### Admin Access

1. Access your Workers domain
2. Enter the set AUTH_PASSWORD password to log in
3. The login status will remain for 30 days

### File Upload

1. After logging in, select the file to upload
2. For files less than 25MB, you can choose the storage method (R2 or D1)
3. Files larger than 25MB will automatically use R2 storage
4. Get the sharing link after the upload is complete

### File Sharing

- Share link format: `https://your-worker.workers.dev/file/[FILE_ID]`
- Anyone can download the file directly through the link
- The link is permanently valid

## Technical details

### Storage mechanism

- **R2 storage**: for large files, no size limit
- **D1 storage**: for small files (<25MB), stored in SQLite database

### Database structure

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

### Security features

- Password-protected admin interface
- HttpOnly Cookie
- Secure file ID generation mechanism

## Configuration options

### Environment variables

| Variable name | Description | Required |
|--------|------|------|
| AUTH_PASSWORD | Admin UI login password | Yes |

### wrangler.toml configuration

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

## Development Guide

### Local Development

1. After cloning the repository, run:
```bash
wrangler dev
```

2. Visit `http://localhost:8787` for testing

### Code structure

```
file-share-worker/
├── src/
│ ├── index.js # Main entry file
│ ├── auth.js # Authentication related logic
│ ├── storage/
│ │ ├── r2.js # R2 storage processing
│ │ └── d1.js # D1 storage processing
│ │ └── manager.js # Storage manager
│ ├── utils/
│ │ ├── response.js # Response processing tool
│ │ └── id.js # File ID generator
│ └── html/
│ └── templates.js # HTML template
├── wrangler.toml # Cloudflare configuration
└── migrations/ # D1 database migration
└── init.sql
```

## Contribution Guide

1. Fork This repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Credits

- Cloudflare Workers Platform
- Claude-3.5-Sonnet AI

## Feedback

If you find any issues or have suggestions for improvements, please create an [issue](https://github.com/joyance-professional/cf-files-sharing/issues).
