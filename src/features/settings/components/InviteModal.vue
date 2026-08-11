<template>
  <Teleport to="body">
    <div 
      v-if="isOpen && !isReadOnly" 
      class="fixed inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in"
      @click.self="closeModal"
    >
      <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 w-full max-w-lg rounded-2xl shadow-xl overflow-hidden animate-slide-up-fade">
        <div class="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="p-2 bg-slate-100 dark:bg-slate-700 rounded-lg text-slate-700 dark:text-slate-300">
              <UserPlus class="w-4 h-4" />
            </div>
            <div>
              <h3 class="font-black text-lg text-slate-900 dark:text-white">Invite Workspace Member</h3>
              <p class="text-xs font-medium text-slate-400">Grant scoped framework controls instantly</p>
            </div>
          </div>
          <button @click="closeModal" class="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition">
            <X class="w-4 h-4" />
          </button>
        </div>

        <form @submit.prevent="submit" class="p-6 space-y-5">
          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email Address</label>
            <input 
              type="email" 
              required
              v-model="inviteForm.email"
              placeholder="colleague@company.com" 
              class="w-full text-sm bg-transparent border border-slate-200 dark:border-slate-700 focus:border-slate-400 dark:focus:border-slate-500 rounded-xl px-4 py-3 outline-none transition focus:ring-4 focus:ring-slate-500/5 text-slate-900 dark:text-white"
            />
          </div>

          <div class="space-y-2">
            <label class="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assign Workspace Access Role</label>
            <div class="space-y-2.5">
              <div 
                v-for="(role, key) in roles" 
                :key="key"
                @click="inviteForm.role = key"
                :class="[
                  'p-3.5 border-2 rounded-xl flex items-start gap-3 cursor-pointer transition select-none',
                  inviteForm.role === key 
                    ? roleColors[key].activeCard 
                    : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 bg-transparent'
                ]"
              >
                <div 
                  :class="[
                    'mt-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shrink-0', 
                    inviteForm.role === key ? roleColors[key].activeRadioBorder : 'border-slate-300 dark:border-slate-600'
                  ]"
                >
                  <div v-if="inviteForm.role === key" :class="['w-2 h-2 rounded-full', roleColors[key].activeRadioDot]"></div>
                </div>
                
                <div class="space-y-0.5">
                  <div class="flex items-center gap-2">
                    <span class="text-sm font-bold text-slate-900 dark:text-white">{{ role.name }}</span>
                    <span :class="['text-[10px] px-1.5 py-0.2 rounded-md font-bold uppercase border tracking-wide', getRoleStyles(key)]">
                      {{ key }}
                    </span>
                  </div>
                  <p class="text-xs font-medium text-slate-400 dark:text-slate-500 leading-normal">
                    {{ role.description }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="flex items-center gap-3 pt-2">
            <button 
              type="button" 
              @click="closeModal" 
              class="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 font-bold text-slate-700 dark:text-slate-300 text-sm hover:bg-slate-50 dark:hover:bg-slate-900 transition"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              class="flex-1 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold text-sm transition shadow-sm"
            >
              Send Invitation
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { UserPlus, X } from 'lucide-vue-next'
import { roles, roleColors, getRoleStyles } from '../roles'
import type { Role } from '../types'

const props = defineProps<{
  isOpen: boolean
  isReadOnly: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', payload: { email: string; role: Role }): void
}>()

const inviteForm = ref<{ email: string; role: Role }>({
  email: '',
  role: 'read_only'
})

// Reset form when modal opens
watch(() => props.isOpen, (newVal) => {
  if (newVal) inviteForm.value = { email: '', role: 'read_only' }
})

const closeModal = () => emit('close')

const submit = () => {
  emit('submit', inviteForm.value)
}
</script>

<style scoped>
@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slide-up-fade {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-fade-in { animation: fade-in 0.2s cubic-bezier(0.16, 1, 0.3, 1) both; }
.animate-slide-up-fade { animation: slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
</style>
