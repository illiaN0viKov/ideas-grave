// types.ts

// --- User ---
export interface User {
  id: string;
  username: string;
  avatarUrl?: string;
}

// --- Idea Version (history) ---
export interface IdeaVersion {
  id: string;
  ideaId: string;
  content: string;
  modifiedBy: string; // userId
  modifiedAt: Date;
  reason?: string; // optional note for modification
}

// --- Vote ---
export type VoteType = 'abandon' | 'change';

export interface Vote {
  id: string;
  ideaId: string;
  voterId: string; // userId
  type: VoteType;
  createdAt: Date;
}

// --- Suggestion ---
export interface Suggestion {
  id: string;
  ideaId: string;
  userId: string; // user who suggested
  content: string;
  createdAt: Date;
}

// --- Idea ---
export type IdeaStatus = 'active' | 'done' | 'graved';

export interface Idea {
  id: string;
  content: string;
  creatorId: string; // userId
  createdAt: Date;
  status: IdeaStatus;
  emotions: Record<string, number>; // emoji => count
  votes: Vote[];
  suggestions: Suggestion[];
  history: IdeaVersion[];
}