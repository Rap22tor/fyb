// for client (no password info)
export interface PublicUser {
  user_id: number;
  username: string;
  email: string;
  created_at: string;
}

// can be used for creating new User
export interface CreateUserInput {
  username: string;
  email: string;
  password_hash: string;
}