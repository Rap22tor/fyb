import { Db } from "../db/database";
import { ApprovedGroupMemberItem } from "../../shared/groupMemberTypes";


// Get group members list (only 'approved' status)
export function getGroupMembers(db: Db, groupId: number) : ApprovedGroupMemberItem[] {
  const statement = db.prepare(`
    SELECT 
      u.user_id, 
      u.username, 
      gm.role, 
      gm.joined_at
    FROM group_members gm
    JOIN users u ON gm.user_id = u.user_id
    WHERE gm.group_id = ? AND gm.status = 'approved'
    ORDER BY gm.joined_at ASC
  `);
  
  return statement.all(groupId) as ApprovedGroupMemberItem[];
}


export function addGroupMember(
  db: Db, 
  groupId: number, 
  userId: number, 
  role: 'admin' | 'member' = 'member', 
  status: 'approved' | 'pending' = 'approved'
) : number {
  const stmt = db.prepare(`
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES (?, ?, ?, ?)
  `);
  const result = stmt.run(groupId, userId, role, status);
  return Number(result.lastInsertRowid);
}


// Approve new request
export function approveMember(db: Db, membershipId: number) : number {
  const statement = db.prepare(`
    UPDATE group_members 
    SET status = 'approved' 
    WHERE membership_id = ?
  `);
  return statement.run(membershipId).changes; // number of changed lines (1/0)
}


// Decline new request OR remove a member from a group
export function removeGroupMember(db: Db, groupId: number, userId: number) : number {
  const statement = db.prepare(`
    DELETE FROM group_members 
    WHERE group_id = ? AND user_id = ?
  `);
  return statement.run(groupId, userId).changes;
}