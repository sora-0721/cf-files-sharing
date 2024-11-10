# CloudFlare File Share

English｜简体中文

A simple file sharing tool running on Cloudflare Workers, supporting R2 and D1 dual storage solutions.

## Features

- 🔐 Password protection, supports cookie-based persistent login (30 days)
- 💾 Dual storage solution: R2 storage bucket + D1 database
- 📦 Automatic storage selection: files larger than 25MB automatically use R2
- 🔗 Simple sharing links
- 🎨 Minimalist black and white interface design
- 🚀 Cloudflare Workers driven, global high-speed access

## Logic

```
Login process:
User access → Check cookies → No cookies → Display login page → Verify password → Set cookies → Enter home page
                      ↑
              Have cookies → Verify cookies → Enter home page

Upload process:
Select file → Check file size → >25MB → Use R2 storage
                              → ≤25MB → Select storage method → R2 or D1
              ↓
    Generate unique ID → Store file → Return the sharing link

Download process:
Access the sharing link → Parse the file ID → Determine storage location → Retrieve file → Return file content
```

## Deployment Guide

### Prerequisites

- Node.js (16.x or higher)
- Cloudflare account
- Wrangler CLI

### Step 1: Configure the Environment

1. Clone the repository:

   ```bash
   git clone https://github.com/joyance-professional/cf-files-sharing
   cd cf-files-sharing
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Log in to Cloudflare:

   ```bash
   wrangler login
   ```

### Step 2: Create Necessary Cloudflare Resources

1. Create the R2 bucket:

   ```bash
   wrangler r2 bucket create file-share
   ```

2. Create the D1 database:

   ```bash
   wrangler d1 create file-share
   ```

3. Update the database ID in the wrangler.toml file:

   ```toml
   [[d1_databases]]
   binding = "DB"
   database_name = "file-share"
   database_id = "your-database-id" # obtained from the previous step
   ```

### Step 3: Deploy

Deploy to Cloudflare Workers:

```bash
wrangler deploy
```

### Step 4: Configure Environment Variables

1. Set the authentication password:

   ```bash
   wrangler secret put AUTH_PASSWORD
   ```

   When prompted, enter the password you want to set.

### Step 5: Initialize the Database

Run the database migration:

```bash
wrangler d1 execute file-share --file=./migrations/init.sql --remote
```

## Usage Guide

### Admin Access

1. Access your Workers domain.
2. Enter the set AUTH_PASSWORD to log in.
3. The login status will remain for 30 days.

### File Upload

1. After logging in, select the file to upload.
2. For files less than 25MB, you can choose the storage method (R2 or D1).
3. Files larger than 25MB will automatically use R2 storage.
4. Get the sharing link after the upload is complete.

### File Sharing

- Share link format: https://your-worker.workers.dev/file/[FILE_ID]
- Anyone can download the file directly through the link.
- The link is permanently valid.

## Technical Details

### Storage Mechanism

- R2 Storage: Suitable for large files, no size limit.
- D1 Storage: Suitable for small files (<25MB), stored in SQLite database.

### Database Structure

```sql
CREATE TABLE files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content BLOB NULL
);
```

### Security Features

- Password-protected admin interface
- HttpOnly cookies
- Secure file ID generation mechanism

## Configuration Options

### Environment Variables

| Variable Name | Description                 | Required |
|---------------|-----------------------------|----------|
| AUTH_PASSWORD | Admin interface login password | Yes      |

### wrangler.toml Configuration

```toml
name = "file-share-worker"
main = "src/index.js"

[[r2_buckets]]
binding = "FILE_BUCKET"
bucket_name = "file-share"

[[d1_databases]]
binding = "DB"
database_name = "file-share"
database_id = "your-database-id"
```

## Development Guide

### Local Development

1. After cloning the repository, run:

   ```bash
   wrangler dev
   ```

2. Visit http://localhost:8787 for testing.

### Code Structure

```
cf-files-sharing/
├── src/
│   ├── index.js        # Main entry file
│   ├── auth.js         # Authentication logic
│   ├── storage/
│   │   ├── r2.js       # R2 storage handling
│   │   ├── d1.js       # D1 storage handling
│   │   └── manager.js  # Storage manager
│   ├── utils/
│   │   ├── response.js # Response utilities
│   │   └── id.js       # File ID generator
│   └── html/
│       └── templates.js # HTML templates
├── wrangler.toml       # Cloudflare configuration
└── migrations/         # D1 database migrations
    └── init.sql
```

## Contribution Guide

1. Fork this repository.
2. Create your feature branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

## Credits

- Cloudflare Workers Platform
- Claude-3.5-Sonnet AI
- Chat-GPT-o1-preview | Chat History

## Feedback

If you find any issues or have suggestions for improvements, please create an issue
