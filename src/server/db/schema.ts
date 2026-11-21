import { Db } from "./database";

export function initDb(db: Db): void {
  // 1. users
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      user_id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. groups
  db.exec(`
    CREATE TABLE IF NOT EXISTS groups (
      group_id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      tags TEXT,
      is_private INTEGER NOT NULL DEFAULT 0,
      max_capacity INTEGER NOT NULL CHECK (max_capacity BETWEEN 1 AND 50),
      invite_code TEXT UNIQUE,
      owner_id INTEGER NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);

  // 3. group_members
  db.exec(`
    CREATE TABLE IF NOT EXISTS group_members (
      membership_id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      role TEXT NOT NULL DEFAULT 'member', -- 'admin' or 'member'
      status TEXT NOT NULL DEFAULT 'approved', -- 'approved' or 'pending'
      joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
      UNIQUE(group_id, user_id)
    );
  `);

  // 4. study_sessions
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      scheduled_at DATETIME NOT NULL,
      meeting_link TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE
    );
  `);

  // 5. comments
  db.exec(`
    CREATE TABLE IF NOT EXISTS comments (
      comment_id INTEGER PRIMARY KEY AUTOINCREMENT,
      group_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (group_id) REFERENCES groups(group_id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
    );
  `);
}