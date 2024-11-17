
CREATE TABLE IF NOT EXISTS file_metadata (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    size INTEGER NOT NULL,
    storage_type TEXT NOT NULL,
    created_at TEXT NOT NULL
);

-- 创建 file_contents 表
CREATE TABLE IF NOT EXISTS file_contents (
    id TEXT PRIMARY KEY,
    content BLOB NOT NULL
);

-- 创建 settings 表
CREATE TABLE IF NOT EXISTS settings (
    id TEXT PRIMARY KEY,
    theme TEXT,
    backgroundColor TEXT,
    textColor TEXT,
    buttonColor TEXT,
    buttonTextColor TEXT,
    headerBackground TEXT,
    headerTextColor TEXT,
    backgroundImage TEXT,
    language TEXT
);
