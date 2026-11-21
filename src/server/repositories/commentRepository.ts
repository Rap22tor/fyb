import { Db } from "../db/database";
import { CommentWithAuthor } from "../../shared/commentTypes";
import { CreateCommentInput } from "../../shared/commentTypes";


// Get group comments + its authors
export function getGroupComments(db: Db, groupId: number) : CommentWithAuthor[] {
  const statement = db.prepare(`
    SELECT 
      c.comment_id, 
      c.content, 
      c.created_at, 
      u.user_id, 
      u.username
    FROM comments c
    JOIN users u ON c.user_id = u.user_id
    WHERE c.group_id = ?
    ORDER BY c.created_at ASC
  `);
  
  return statement.all(groupId) as CommentWithAuthor[];
}


export function addComment(db: Db, data: CreateCommentInput) : number {
  const statement = db.prepare(`
    INSERT INTO comments (group_id, user_id, content)
    VALUES (?, ?, ?)
  `);
  const result = statement.run(data.groupId, data.userId, data.content);
  return Number(result.lastInsertRowid);
}