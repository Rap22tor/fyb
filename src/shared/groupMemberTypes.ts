export interface ApprovedGroupMemberItem {
  user_id: number;
  username: string;
  role: 'admin' | 'member';
  joined_at: string;
}

export interface PendingMembershipRequestItem {
  membership_id: number;
  group_id: number;
  user_id: number;
  username: string;
  status: 'pending';
  joined_at: string;
}