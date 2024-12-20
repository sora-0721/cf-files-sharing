CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    preview_enabled INTEGER DEFAULT 0，
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    content BLOB
);

CREATE INDEX IF NOT EXISTS idx_created_at ON files(created_at);
