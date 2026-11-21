import { Db } from "../db/database";
import { GroupSummary } from "../../shared/groupTypes";
import { UserGroupItem } from "../../shared/groupTypes";
import { GroupWithMembership } from "../../shared/groupTypes";
import { UpdateGroupMetadataInput } from "../../shared/groupTypes";
import { CreateGroupInput } from "../../shared/groupTypes";


// Home page: get all groups list (+ Search, + Filtering)
export function getGroups(db: Db, searchQuery?: string, isPrivate?: number): GroupSummary[] {
  let query = `
    SELECT group_id, title, description, tags, is_private, max_capacity, owner_id, created_at
    FROM groups
    WHERE 1=1
  `;
  const params: Array<string | number> = [];

  if (isPrivate !== undefined) {
    query += ` AND is_private = ?`;
    params.push(isPrivate);
  }

  if (searchQuery && searchQuery.trim() !== "") {
    query += ` AND (title LIKE ? OR tags LIKE ?)`;
    params.push(`%${searchQuery.trim()}%`, `%${searchQuery.trim()}%`);
  }

  query += ` ORDER BY created_at DESC`;

  const statement = db.prepare(query);
  return statement.all(...params) as GroupSummary[];
}


// for "My Groups" list (membership status = "approved")
export function getUserGroups(db: Db, userId: number): UserGroupItem[] {
  const statement = db.prepare(`
    SELECT
      g.group_id,
      g.title,
      g.description,
      g.tags,
      g.is_private,
      g.max_capacity,
      g.owner_id,
      g.created_at,
      gm.role,
      gm.status,
      gm.joined_at
    FROM groups g
    JOIN group_members gm ON g.group_id = gm.group_id
    WHERE gm.user_id = ? AND gm.status = 'approved'
    ORDER BY g.created_at DESC
  `);

  return statement.all(userId) as UserGroupItem[]; // returns list of groups
}


// Get ONE group basic info + the User's status in this group
export function getGroupWithUserMembership(db: Db, groupId: number, userId: number): GroupWithMembership | undefined {
  const statement = db.prepare(`
    SELECT
      g.group_id,
      g.title,
      g.description,
      g.tags,
      g.is_private,
      g.max_capacity,
      g.owner_id,
      g.created_at,
      gm.role,
      gm.status
    FROM groups g
    LEFT JOIN group_members gm ON g.group_id = gm.group_id AND gm.user_id = ?
    WHERE g.group_id = ?
  `);

  return statement.get(userId, groupId) as GroupWithMembership | undefined; // return ONE group info
}


export function getGroupInviteCode(db: Db, groupId: number) : string | null | undefined { // invite_code can be null
  const statement = db.prepare(`SELECT invite_code FROM groups WHERE group_id = ?`);
  const result = statement.get(groupId) as { invite_code: string } | undefined;
  return result?.invite_code;
}


// Creating a new group
export function addGroup(db: Db, data: CreateGroupInput): number {
  const insertGroupQuery = db.prepare(`
    INSERT INTO groups (title, description, tags, is_private, max_capacity, invite_code, owner_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMemberQuery = db.prepare(`
    INSERT INTO group_members (group_id, user_id, role, status)
    VALUES (?, ?, 'admin', 'approved')
  `);

  // this transaction combines 2 operations (add new group + add admin) into 1 single action:
  const createGroupTx = db.transaction((groupData: CreateGroupInput): number => {
    const result = insertGroupQuery.run(
      groupData.title,
      groupData.description,
      groupData.tags,
      groupData.isPrivate,
      groupData.maxCapacity,
      groupData.inviteCode,
      groupData.ownerId
    );

    const groupId = Number(result.lastInsertRowid);
    insertMemberQuery.run(groupId, groupData.ownerId);

    return groupId;
  });

  return createGroupTx(data);
}


export function updateGroupMetadata(db: Db, groupId: number, data: UpdateGroupMetadataInput) : number {
  const statement = db.prepare(`
    UPDATE groups 
    SET title = ?, description = ?, tags = ?, max_capacity = ?, is_private = ?
    WHERE group_id = ?
  `);
  
  const result = statement.run(data.title, data.description ?? null, data.tags ?? null, data.maxCapacity, data.isPrivate, groupId);
  return result.changes;
}


// Delete Group
export function deleteGroup(db: Db, groupId: number) : number {
  const statement = db.prepare(`
    DELETE FROM groups WHERE group_id = ?
  `);
  
  const result = statement.run(groupId);
  return result.changes; // returns number of deleted lines (0 if not found)
}