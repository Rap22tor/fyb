export interface StudySession {
  session_id: number;
  group_id: number;
  title: string;
  scheduled_at: string;
  meeting_link: string | null;
  created_at: string;
}

export interface CreateStudySessionInput {
  groupId: number;
  title: string;
  scheduledAt: string;
  meetingLink?: string | null;
}

export interface UpdateStudySessionInput {
  title: string;
  scheduledAt: string;
  meetingLink?: string | null;
}