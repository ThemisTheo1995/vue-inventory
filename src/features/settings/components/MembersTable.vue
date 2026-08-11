<template>
  <div>
    <div v-if="filteredMembers.length === 0" class="text-center py-16 px-4">
      <p class="text-sm font-bold text-slate-900 dark:text-white mb-0.5">No matching results found</p>
      <p class="text-xs text-slate-400 font-medium">Try adjusting your filters or search terms to find your team member.</p>
    </div>

    <div v-else class="overflow-auto max-h-[60vh] relative rounded-b-2xl">
      <table class="w-full text-left border-collapse">
        <thead class="sticky top-0 z-10 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm outline outline-1 outline-slate-100 dark:outline-slate-700/50 shadow-sm">
          <tr class="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <th class="py-4 px-6">Member</th>
            <th class="py-4 px-6">System Access Role</th>
            <th class="py-4 px-6">Status</th>
            <th v-if="!isReadOnly" class="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100 dark:divide-slate-700/40 text-sm">
          <tr v-for="member in filteredMembers" :key="member.id" class="group hover:bg-slate-50/40 dark:hover:bg-slate-900/10 transition-colors">
            
            <td class="py-4 px-6">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center font-bold text-slate-700 dark:text-slate-200 shadow-inner shrink-0">
                  {{ member.name ? member.name.charAt(0) : '?' }}
                </div>
                <div class="flex flex-col min-w-0">
                  <span class="font-bold text-slate-900 dark:text-white truncate">
                    {{ member.name || 'Invited User' }}
                  </span>
                  <span class="text-xs text-slate-400 dark:text-slate-500 truncate font-medium">
                    {{ member.email }}
                  </span>
                </div>
              </div>
            </td>

            <td class="py-4 px-6 vertical-align-middle">
              <span :class="['inline-block px-2.5 py-1 rounded-lg text-xs font-bold border tracking-wide uppercase', getRoleStyles(member.role)]">
                {{ roles[member.role]?.name || member.role }}
              </span>
            </td>

            <td class="py-4 px-6">
              <span 
                :class="[
                  'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold',
                  member.status === 'active' 
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                    : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 animate-pulse'
                ]"
              >
                <span :class="['w-1.5 h-1.5 rounded-full', member.status === 'active' ? 'bg-emerald-500' : 'bg-amber-500']"></span>
                {{ member.status === 'active' ? 'Active' : 'Pending' }}
              </span>
            </td>

            <td v-if="!isReadOnly" class="py-4 px-6 text-right">
              <div class="flex items-center justify-end gap-2">
                <select 
                  :value="member.role"
                  @change="$emit('updateRole', member.id, ($event.target as HTMLSelectElement).value as Role, $event)"
                  class="text-xs bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 font-semibold text-slate-600 dark:text-slate-300 outline-none focus:ring-2 focus:ring-slate-500/20 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity duration-150"
                >
                  <option v-for="(r, key) in roles" :key="key" :value="key">{{ r.name }}</option>
                </select>
                <button 
                  @click="$emit('removeMember', member.id)"
                  class="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                  title="Remove access"
                >
                  <Trash2 class="w-4 h-4" />
                </button>
              </div>
            </td>

          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'
import { roles, getRoleStyles } from '../roles'
import type { TeamMember, Role } from '../types'

defineProps<{
  filteredMembers: TeamMember[]
  isReadOnly: boolean
}>()

defineEmits<{
  (e: 'updateRole', id: string, role: Role, event: Event): void
  (e: 'removeMember', id: string): void
}>()
</script>
