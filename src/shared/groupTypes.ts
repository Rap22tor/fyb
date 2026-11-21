// basic info for Main Page catalogue (list of group): everything except invite_code attribute
export interface GroupSummary {
  group_id: number;
  title: string;
  tags?: string | null;
  description?: string | null;
  is_private: number;
  max_capacity: number;
  owner_id: number;
  created_at: string;
}

// for getUserGroups() - "My Groups" list (membership status = "approved")
export interface UserGroupItem extends GroupSummary {
  role: 'admin' | 'member';
  status: 'approved' | 'pending';
  joined_at: string;
}

// basic group info + membership info (role, request status, joined_at datetime)
// for getGroupWithUserMembership, so null is necessary if User is not in the group
export interface GroupWithMembership extends GroupSummary {
  role?: 'admin' | 'member' | null;
  status?: 'approved' | 'pending' | null;
}

// can be used for creating new group
export interface CreateGroupInput {
  title: string;
  description?: string | null;
  tags?: string | null;
  isPrivate: number;
  maxCapacity: number;
  inviteCode: string;
  ownerId: number;
}

// can be used for updating group info
export interface UpdateGroupMetadataInput {
  title: string;
  description?: string | null;
  tags?: string | null;
  maxCapacity: number;
  isPrivate: number;
}