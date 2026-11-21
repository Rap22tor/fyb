export interface CommentWithAuthor {
  comment_id: number;
  content: string;
  created_at: string;
  user_id: number;
  username: string;
}

export interface CreateCommentInput {
  groupId: number;
  userId: number;
  content: string;
}