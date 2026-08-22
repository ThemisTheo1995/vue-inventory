<!-- src/views/NotesView.vue -->
<template>
  <div>
    <!-- Dynamic Backdrop when Maximized -->
    <transition name="fade">
      <div 
        v-if="isNotesOpen && isMaximized" 
        class="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40"
        @click="isMaximized = false"
      ></div>
    </transition>

    <!-- Floating / Maximized Notes Widget Container -->
    <div 
      :class="[
        'fixed z-50 transition-all duration-300 ease-in-out flex flex-col items-end',
        isMaximized 
          ? 'inset-4 sm:inset-10' 
          : 'bottom-4 right-4 sm:bottom-6 sm:right-6'
      ]"
    >
      <!-- Notes Panel -->
      <transition name="slide-up">
        <div 
          v-if="isNotesOpen" 
          :class="[
            'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ease-in-out',
            isMaximized 
              ? 'w-full h-full' 
              : 'w-72 sm:w-96 mb-3 sm:mb-4 h-72 sm:h-80'
          ]"
        >
          <!-- Header -->
          <div class="bg-slate-50 dark:bg-slate-800/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center select-none">
            <div class="flex items-center gap-2 cursor-pointer" @click="isMaximized = !isMaximized">
              <PenLine class="w-4 h-4 text-brand-500" />
              <h3 class="font-bold text-sm text-slate-900 dark:text-white">Quick Notes</h3>
              <span class="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-1.5 py-0.5 rounded font-medium ml-1">
                {{ isMaximized ? 'Expanded' : 'Compact' }}
              </span>
            </div>
            
            <div class="flex items-center gap-1">
              <button 
                @click="isMaximized = !isMaximized" 
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                :title="isMaximized ? 'Restore' : 'Maximize'"
              >
                <Minimize2 v-if="isMaximized" class="w-4 h-4" />
                <Maximize2 v-else class="w-4 h-4" />
              </button>
              <button 
                @click="closeNotes" 
                class="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-200/50 dark:hover:bg-slate-700/50 transition-colors"
                title="Close"
              >
                <X class="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <!-- Body -->
          <div class="p-0 flex-1 relative flex flex-col">
            <div v-if="isLoadingInitial" class="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-slate-800/60 z-10 backdrop-blur-[1px]">
              <div class="w-6 h-6 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
            </div>

            <textarea 
              v-model="notesContent"
              @input="handleInput"
              placeholder="Jot down quick reminders, draft order IDs, or temporary details here..." 
              class="w-full flex-1 p-4 bg-transparent md:text-[13px] text-xs text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none outline-none focus:ring-0 border-none"
            ></textarea>
            
            <!-- Footer Status Bar -->
            <div class="p-3 bg-slate-50/50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-[11px] font-medium text-slate-400 dark:text-slate-500 select-none">
              <span>{{ notesContent.length }} characters</span>

              <!-- Smooth State Cross-Fade Container -->
              <div class="h-4 flex items-center">
                <transition name="status-fade" mode="out-in">
                  
                  <!-- State 1: Error -->
                  <div v-if="saveError" key="error" class="flex items-center gap-1.5 text-rose-500">
                    <AlertCircle class="w-3.5 h-3.5" />
                    <span>Failed to save</span>
                  </div>

                  <!-- State 2: Green Saved State -->
                  <div 
                    v-else-if="!hasUnsavedChanges && !isSaving && notesContent.length > 0" 
                    key="saved" 
                    class="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 class="w-3.5 h-3.5 text-emerald-500 scale-pop" />
                    <span>Saved</span>
                  </div>

                  <!-- State 3: Blank while typing or saving -->
                  <div v-else key="blank"></div>

                </transition>
              </div>
            </div>
          </div>
        </div>
      </transition>

      <!-- FAB Toggle Button (Responsive Sizing) -->
      <button 
        v-if="!isMaximized"
        @click="toggleNotes"
        :class="[
          'flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-lg transition-all duration-300 hover:scale-105 active:scale-95',
          isNotesOpen 
            ? 'bg-slate-800 dark:bg-slate-700 text-white' 
            : 'bg-brand-500 hover:bg-brand-600 text-white shadow-brand-500/30'
        ]"
      >
        <transition name="fade" mode="out-in">
          <X v-if="isNotesOpen" class="w-4 h-4 sm:w-5 sm:h-5" />
          <div v-else class="relative flex items-center justify-center">
            <StickyNote class="w-4 h-4 sm:w-5 sm:h-5" />
            <span 
              v-if="notesContent.length > 0" 
              class="absolute -top-0.5 -right-0.5 sm:-top-1 sm:-right-1 w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-400 border-2 border-brand-500 rounded-full"
            ></span>
          </div>
        </transition>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  PenLine, 
  X, 
  CheckCircle2, 
  StickyNote,
  Maximize2,
  Minimize2,
  AlertCircle
} from 'lucide-vue-next'
import { noteService } from '../services/note.services'

const route = useRoute()
const workspaceId = computed(() => route.params.workspaceId as string)

// UI State
const isNotesOpen = ref(false)
const isMaximized = ref(false)

// Data State
const currentNoteId = ref<string | null>(null)
const notesContent = ref('')
const isLoadingInitial = ref(false)
const isSaving = ref(false)
const hasUnsavedChanges = ref(false)
const saveError = ref(false)

let saveTimeout: ReturnType<typeof setTimeout> | null = null

// Keyboard event handler for Escape key
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && isNotesOpen.value) {
    closeNotes()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})

// Reset notes state when switching workspace dynamically
watch(workspaceId, () => {
  currentNoteId.value = null
  notesContent.value = ''
  if (isNotesOpen.value) {
    fetchActiveNote()
  }
})

const toggleNotes = async () => {
  isNotesOpen.value = !isNotesOpen.value
  
  if (!isNotesOpen.value) {
    isMaximized.value = false
  } else {
    if (!hasUnsavedChanges.value && !isSaving.value) {
      await fetchActiveNote()
    }
  }
}

const closeNotes = () => {
  isNotesOpen.value = false
  isMaximized.value = false
}

const fetchActiveNote = async () => {
  if (!workspaceId.value) return
  try {
    isLoadingInitial.value = true
    const response = await noteService.getAll(workspaceId.value, 1, 1)
    
    const note = response.items?.[0]
    if (note) {
      currentNoteId.value = note.id
      notesContent.value = note.content || ''
    }
  } catch (error) {
    console.error("Failed to load note", error)
  } finally {
    isLoadingInitial.value = false
  }
}

const handleInput = () => {
  hasUnsavedChanges.value = true
  saveError.value = false

  if (saveTimeout) clearTimeout(saveTimeout)
  if (!notesContent.value.trim() && !currentNoteId.value) {
    hasUnsavedChanges.value = false
    return
  }

  saveTimeout = setTimeout(async () => {
    await persistNote()
  }, 1500)
}

const persistNote = async () => {
  if (!workspaceId.value) return
  const MIN_SAVING_DURATION = 700

  try {
    isSaving.value = true
    
    const delayPromise = new Promise((resolve) => setTimeout(resolve, MIN_SAVING_DURATION))

    if (currentNoteId.value) {
      await Promise.all([
        noteService.update(workspaceId.value, currentNoteId.value, { 
          content: notesContent.value 
        }),
        delayPromise
      ])
    } else {
      const [newNote] = await Promise.all([
        noteService.create(workspaceId.value, { 
          content: notesContent.value,
          title: "Quick Note"
        }),
        delayPromise
      ])
      currentNoteId.value = newNote.id
    }

    hasUnsavedChanges.value = false
  } catch (error) {
    console.error("Failed to save note:", error)
    saveError.value = true
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
/* Panel slide transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-up-enter-from,
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(16px) scale(0.96);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Smooth Status Fade Transitions */
.status-fade-enter-active,
.status-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.status-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.status-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

/* Spring Pop Effect when Saved */
.scale-pop {
  animation: pop 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes pop {
  0% { transform: scale(0.5); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
