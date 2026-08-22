// src/services/notes.service.ts

import { apiFetch } from '@/utils/apiFetch'
import type { 
  Note, 
  NoteCreate, 
  NoteUpdate, 
  PaginatedNotes 
} from '../types/note.types'

class NoteService {
  /**
   * Get all notes for the current workspace/user
   */
  async getAll(workspaceId: string, page = 1, limit = 20): Promise<PaginatedNotes> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString()
    })
    
    const response = await apiFetch(`/${workspaceId}/notes?${params}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  /**
   * Get a specific note
   */
  async getOne(workspaceId: string, noteId: string): Promise<Note> {
    const response = await apiFetch(`/${workspaceId}/notes/${noteId}`, { 
      method: 'GET'
    })
    
    return await response.json()
  }

  /**
   * Create a new note
   */
  async create(workspaceId: string, data: NoteCreate): Promise<Note> {
    const response = await apiFetch(`/${workspaceId}/notes`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    
    return await response.json()
  }

  /**
   * Update an existing note
   */
  async update(workspaceId: string, noteId: string, data: NoteUpdate): Promise<Note> {
    const response = await apiFetch(`/${workspaceId}/notes/${noteId}`, {
      method: 'PATCH',
      body: JSON.stringify(data)
    })
    
    return await response.json()
  }

  /**
   * Delete a note
   */
  async delete(workspaceId: string, noteId: string): Promise<void> {
    await apiFetch(`/${workspaceId}/notes/${noteId}`, {
      method: 'DELETE'
    })
  }
}

export const noteService = new NoteService()
