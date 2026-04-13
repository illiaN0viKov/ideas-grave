import { Idea, User, Suggestion } from "../../lib/types/types-ideas";

// --- Users ---
export const users: User[] = [
  { id: 'u1', username: 'Alice' },
  { id: 'u2', username: 'Bob'},
  { id: 'u3', username: 'Charlie'},
];

// --- Ideas ---
export const ideas: Idea[] = [
  {
    id: 'i1',
    content: 'Add dark mode to the app',
    creatorId: 'u1',
    createdAt: new Date('2026-03-15T10:00:00Z'),
    status: 'active',
    emotions: { '👍': 3, '❤️': 2 },
    votes: [
      { id: 'v1', ideaId: 'i1', voterId: 'u2', type: 'abandon', createdAt: new Date('2026-03-15T11:00:00Z') },
      { id: 'v2', ideaId: 'i1', voterId: 'u3', type: 'change', createdAt: new Date('2026-03-15T11:30:00Z') },
    ],
    suggestions: [
      { id: 's1', ideaId: 'i1', userId: 'u3', content: 'Add theme switch in settings', createdAt: new Date('2026-03-15T12:00:00Z') },
    ],
    history: [
      { id: 'h1', ideaId: 'i1', content: 'Add dark mode to the app', modifiedBy: 'u1', modifiedAt: new Date('2026-03-15T10:00:00Z'), reason: 'Original idea' },
    ],
  },
  {
    id: 'i2',
    content: 'Create mobile-friendly swipeable lobby',
    creatorId: 'u2',
    createdAt: new Date('2026-03-16T09:00:00Z'),
    status: 'done',
    emotions: { '🤯': 1, '👍': 4 },
    votes: [
      { id: 'v3', ideaId: 'i2', voterId: 'u1', type: 'abandon', createdAt: new Date('2026-03-16T09:30:00Z') },
    ],
    suggestions: [],
    history: [
      { id: 'h2', ideaId: 'i2', content: 'Create mobile-friendly swipeable lobby', modifiedBy: 'u2', modifiedAt: new Date('2026-03-16T09:00:00Z'), reason: 'Original idea' },
    ],
  },
  {
    id: 'i3',
    content: 'Implement idea version history view',
    creatorId: 'u3',
    createdAt: new Date('2026-03-16T14:00:00Z'),
    status: 'graved',
    emotions: { '❤️': 5 },
    votes: [],
    suggestions: [
      { id: 's2', ideaId: 'i3', userId: 'u1', content: 'Use timeline UI for versions', createdAt: new Date('2026-03-16T14:30:00Z') },
    ],
    history: [
      { id: 'h3', ideaId: 'i3', content: 'Implement idea version history view', modifiedBy: 'u3', modifiedAt: new Date('2026-03-16T14:00:00Z'), reason: 'Original idea' },
    ],
  },
];

// --- Optional: Map users to idea reactions and votes for quick lookup ---
export const userMap = Object.fromEntries(users.map(u => [u.id, u]));