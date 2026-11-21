import { Db } from "../db/database";
import { AuthUser } from "../../shared/authTypes";
import { CreateUserInput } from "../../shared/userTypes";
import { PublicUser } from "../../shared/userTypes";


// Register (add) new User:
export function addUser(db: Db, data: CreateUserInput) : number {
  // 1. Safe SQL-query with "?""
  const statement = db.prepare(`
    INSERT INTO users (username, email, password_hash)
    VALUES (?, ?, ?)
  `);

  // 2. SQL-query
  const result = statement.run(data.username, data.email, data.password_hash);

  // result.lastInsertRowid — ID of a freshly made row in the table
  return Number(result.lastInsertRowid);
}


export function findUserByEmail(db: Db, email: string): AuthUser | undefined {
  const findUserQuery = db.prepare(`
    SELECT user_id, username, email, password_hash, created_at
    FROM users
    WHERE email = ?
  `);

  return findUserQuery.get(email) as AuthUser | undefined;
}


export function findUserByUsername(db: Db, username: string): PublicUser | undefined {
  const statement = db.prepare(`
    SELECT user_id, username, email, created_at
    FROM users
    WHERE username = ?
  `);

  return statement.get(username) as PublicUser | undefined;
}


export function deleteUser(db: Db, userId: number) : number {
  const statement = db.prepare(`
    DELETE FROM users WHERE user_id = ?
  `);
  
  const result = statement.run(userId);
  // returns number of the deleted rows (0 if User not found)
  return result.changes;
}