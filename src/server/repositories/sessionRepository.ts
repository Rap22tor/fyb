import { Db } from "../db/database";
import { StudySession } from "../../shared/sessionTypes";
import { CreateStudySessionInput } from "../../shared/sessionTypes";
import { UpdateStudySessionInput } from "../../shared/sessionTypes";


// Get all group study sessions
export function getGroupStudySessions(db: Db, groupId: number): StudySession[] {
  const statement = db.prepare(`
    SELECT session_id, group_id, title, scheduled_at, meeting_link, created_at
    FROM sessions
    WHERE group_id = ?
    ORDER BY scheduled_at ASC
  `);

  return statement.all(groupId) as StudySession[];
}


// Add new study session
export function addStudySession(db: Db, data: CreateStudySessionInput) : number {
  const statement = db.prepare(`
    INSERT INTO sessions (group_id, title, scheduled_at, meeting_link)
    VALUES (?, ?, ?, ?)
  `);
  const result = statement.run(data.groupId, data.title, data.scheduledAt, data.meetingLink ?? null);
  return Number(result.lastInsertRowid);
}


export function updateStudySession(db: Db, sessionId: number, data: UpdateStudySessionInput) : number {
  const statement = db.prepare(`
    UPDATE sessions 
    SET title = ?, scheduled_at = ?, meeting_link = ?
    WHERE session_id = ?
  `);
  const result = statement.run(data.title, data.scheduledAt, data.meetingLink ?? null, sessionId);
  return result.changes; // number of changed lines
}