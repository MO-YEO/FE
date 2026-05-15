export interface PageInfo {
  totalElements: number;
  totalPages: number;
  page: number;
  size: number;
}

// ------------------------
// Member Types
// ------------------------
export interface MyProfileResponse {
  memberId: number;
  email: string;
  contactEmail: string;
  emailVerified: boolean;
  nickname: string;
  role: string;
  intro: string;
  githubUrl: string;
  profileImageUrl: string;
  techStacks: string[];
  activityCategories: string[];
  phoneNumber: string;
}

export interface UpdateMyProfileRequest {
  nickname: string;
  profileImageUrl: string;
  role: string;
  contactEmail: string;
  phoneNumber: string;
  githubUrl: string;
  intro: string;
  techStacks: string[];
  activityCategories: string[];
}

export interface Member {
  memberId: number;
  nickname: string;
  role: string;
  intro: string;
  githubUrl: string;
  profileImageUrl: string;
  techStacks: string[];
  activityCategories: string[];
  isBookmarked?: boolean;
}

export interface TeamProfileRegisterRequest {
  nickname: string;
  role: string;
  contactEmail: string;
  phoneNumber: string;
  githubUrl: string;
  intro: string;
  profileImageUrl: string;
  techStacks: string[];
  activityCategories: string[];
}

export interface TeamProfileRegisterResponse {
  memberId: number;
  email: string;
  contactEmail: string;
  emailVerified: boolean;
  nickname: string;
  role: string;
  intro: string;
  githubUrl: string;
  profileImageUrl: string;
  techStacks: string[];
  activityCategories: string[];
  phoneNumber: string;
  teamProfileRegistered: boolean;
}

export interface MemberDetail {
  memberId: number;
  nickname: string;
  departmentName?: string;
  role?: string;
  intro?: string;
  content?: string;
  githubUrl?: string;
  profileImageUrl?: string;
  techStacks?: string[];
  activityCategories?: string[];
  tags?: string[];
  isBookmarked?: boolean;
}

export interface MemberListResponse {
  items: Member[];
  pageInfo: PageInfo;
}

// ------------------------
// Recruit (Project) Types
// ------------------------
export interface Author {
  memberId: number;
  nickname: string;
  departmentName: string;
}

export interface RecruitSummary {
  recruitId: number;
  type: string;
  category: string;
  tag: string;
  department: string;
  title: string;
  status: "OPEN" | "CLOSED";
  skills: string[];
  appliedByMe: boolean;
  applicantCount: number;
  totalHeadcount: number;
  deadline: string;
  createdAt: string;
  author: Author;
  content: string;
}

export interface MyRecruitSummary {
  recruitId: number;
  type: string;
  category: string;
  tag: string;
  department: string;
  title: string;
  status: "OPEN" | "CLOSED";
  skills: string[];
  appliedByMe: boolean;
  applicantCount: number;
  totalHeadcount: number;
  deadline: string;
  createdAt: string;
  author: Author;
  activityCategory: string;
  recruitCategory: string;
}


export interface MyRecruitListResponse {
  recruits: MyRecruitSummary[];
  pageInfo: PageInfo;
}

export interface AppliedRecruitSummary {
  recruitId: number;
  title: string;
  type: string;
  status: "OPEN" | "CLOSED";
  skills: string[];
  applicationStatus: string;
  deadline: string;
  createdAt: string;
}

export interface AppliedRecruitListResponse {
  recruits: AppliedRecruitSummary[];
  pageInfo: PageInfo;
}

export interface RecruitListResponse {
  recruits: RecruitSummary[];
  pageInfo: PageInfo;
}

export interface RecruitDetail extends RecruitSummary {
  content: string;
  contactUrl: string;
}

export interface RecruitApplicant {
  applicationId: number;
  applicant: {
    memberId: number;
    nickname: string;
    contactEmail: string;
  };
  status: string;
  createdAt: string;
}

export interface RecruitApplicationsResponse {
  applications: RecruitApplicant[];
  pageInfo: PageInfo;
}

export interface RecruitApplicant {
  applicationId: number;
  applicant: {
    memberId: number;
    nickname: string;
    contactEmail: string;
  };
  status: string;
  createdAt: string;
}

export interface RecruitApplicationsResponse {
  applications: RecruitApplicant[];
  pageInfo: PageInfo;
}

// ------------------------
// Board Types
// ------------------------
export interface BoardPostSummary {
  postId: number;
  title: string;
  content?: string;
  createdAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  bookmarkedByMe?: boolean;
  isLiked?: boolean;
  isBookmarked?: boolean;
  authorName?: string;
  authorId?: number;
  author?: {
    memberId: number;
    nickname: string;
  };
}

export interface BoardListResponse {
  posts: BoardPostSummary[];
  pageInfo: PageInfo;
}
