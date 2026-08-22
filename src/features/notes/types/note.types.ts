// src/types/note.types.ts

export interface Note {
  id: string;
  workspace_user_id: string;
  title: string | null;
  content: string;
  is_pinned: boolean;
  color: string | null;
  created_at: string;
  updated_at: string;
}

export interface NoteCreate {
  title?: string | null;
  content: string;
  is_pinned?: boolean;
  color?: string | null;
}

export interface NoteUpdate {
  title?: string | null;
  content?: string;
  is_pinned?: boolean;
  color?: string | null;
}

export interface PaginatedNotes {
  items: Note[];
  total: number;
}
