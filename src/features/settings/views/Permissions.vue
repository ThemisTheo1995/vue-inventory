<template>
  <div class="space-y-8 animate-slide-up-fade sm:pb-4 md:pb-8 lg:pb-16">
    
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div class="space-y-1">
        <p class="text-slate-500 dark:text-slate-400 font-medium text-sm">
          Manage workspace members, track invitations, and configure system access roles.
        </p>
      </div>
      <button 
        v-if="!isReadOnly"
        @click="isInviteModalOpen = true"
        class="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-950 font-bold py-2.5 px-4 rounded-xl transition active:scale-[0.98] shadow-sm text-sm shrink-0"
      >
        <UserPlus class="w-4 h-4" />
        Invite Team Member
      </button>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div 
        @click="statusFilter = 'all'"
        :class="['bg-white dark:bg-slate-800/60 p-4 flex items-center gap-4 rounded-xl border transition cursor-pointer select-none', statusFilter === 'all' ? 'border-slate-900 dark:border-white ring-2 ring-slate-900/5 dark:ring-white/5' : 'border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600']"
      >
        <div class="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-xl text-slate-600 dark:text-slate-300"><Users class="w-5 h-5" /></div>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
          <p class="text-2xl font-black text-slate-900 dark:text-white">{{ members.length }}</p>
        </div>
      </div>
      <div 
        @click="statusFilter = 'active'"
        :class="['bg-white dark:bg-slate-800/60 p-4 flex items-center gap-4 rounded-xl border transition cursor-pointer select-none', statusFilter === 'active' ? 'border-emerald-500 ring-2 ring-emerald-500/5 dark:ring-emerald-500/10' : 'border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600']"
      >
        <div class="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400"><ShieldCheck class="w-5 h-5" /></div>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Active</p>
          <p class="text-2xl font-black text-emerald-600 dark:text-emerald-400">{{ members.filter(m => m.status === 'active').length }}</p>
        </div>
      </div>
      <div 
        @click="statusFilter = 'pending'"
        :class="['bg-white dark:bg-slate-800/60 p-4 flex items-center gap-4 rounded-xl border transition cursor-pointer select-none', statusFilter === 'pending' ? 'border-amber-500 ring-2 ring-amber-500/5 dark:ring-amber-500/10' : 'border-slate-200/60 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600']"
      >
        <div class="p-3 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400"><MailCheck class="w-5 h-5" /></div>
        <div>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Invites</p>
          <p class="text-2xl font-black text-amber-600 dark:text-amber-400">{{ members.filter(m => m.status === 'pending').length }}</p>
        </div>
      </div>
    </div>

    <div class="bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl overflow-hidden shadow-sm">
      
      <div v-if="isLoading" class="text-center py-20 px-4">
        <div class="inline-block w-8 h-8 border-4 border-slate-200 border-t-slate-900 dark:border-slate-700 dark:border-t-white rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium text-slate-500 dark:text-slate-400">Loading team directory...</p>
      </div>

      <div v-else-if="members.length === 0" class="text-center py-16 px-4">
        <div class="w-12 h-12 bg-slate-50 dark:bg-slate-900 flex items-center justify-center rounded-2xl mx-auto mb-4 border border-slate-100 dark:border-slate-800">
          <Users class="w-6 h-6 text-slate-400" />
        </div>
        <h3 class="text-lg font-bold text-slate-900 dark:text-white mb-1">No members added yet</h3>
        <p class="text-slate-500 dark:text-slate-400 font-medium text-sm max-w-sm mx-auto mb-5">
          Get started by adding your team members and configuring their specific access levels.
        </p>
        <button 
          v-if="!isReadOnly"
          @click="isInviteModalOpen = true"
          class="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-bold hover:bg-slate-200 dark:hover:bg-slate-600 transition text-sm"
        >
          Invite your first colleague
        </button>
      </div>

      <div v-else>
        <div class="p-4 border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-900/5 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div class="w-full md:max-w-xs relative">
            <input 
              type="text" 
              v-model="searchQuery"
              placeholder="Search by name or email..."
              class="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-8 py-2.5 outline-none focus:border-slate-400 dark:focus:border-slate-500 font-medium text-slate-800 dark:text-white transition"
            />
            <span v-if="searchQuery" @click="searchQuery = ''" class="absolute right-2.5 top-3 text-slate-400 hover:text-slate-600 cursor-pointer text-xs font-bold">✕</span>
          </div>

          <div class="w-full md:w-auto flex flex-wrap items-center gap-3">
            <div class="flex items-center gap-1.5">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Role:</label>
              <div class="relative w-36"> 
                <select v-model="roleFilter" class="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-10 py-2 font-semibold text-slate-700 dark:text-slate-300 outline-none transition focus:border-slate-400 appearance-none cursor-pointer">
                  <option value="all">All Roles</option>
                  <option value="full_admin">Full Admin</option>
                  <option value="edit_only">Editor</option>
                  <option value="read_only">Viewer</option>
                </select>
                <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            <div class="flex items-center gap-1.5">
              <label class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Status:</label>
              <div class="relative w-36">
                <select v-model="statusFilter" class="w-full text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl pl-3 pr-10 py-2 font-semibold text-slate-700 dark:text-slate-300 outline-none transition focus:border-slate-400 appearance-none cursor-pointer">
                  <option value="all">All Statuses</option>
                  <option value="active">Active Only</option>
                  <option value="pending">Pending Only</option>
                </select>
                <ChevronDown class="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none dark:text-slate-500" />
              </div>
            </div>

            <button v-if="roleFilter !== 'all' || statusFilter !== 'all' || searchQuery !== ''" @click="clearAllFilters" class="text-xs text-red-500 hover:text-red-600 font-bold px-2 py-1 transition">
              Reset Filters
            </button>
          </div>
        </div>

        <div class="border-b border-slate-100 dark:border-slate-700/50 bg-slate-50/20 dark:bg-slate-900/5">
          <button @click="isRolesExpanded = !isRolesExpanded" class="w-full px-6 py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-900/20 transition outline-none">
            <div class="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <ShieldCheck class="w-4 h-4" />
              <span class="text-[11px] font-bold uppercase tracking-wider">View Role Definitions</span>
            </div>
            <ChevronDown :class="['w-4 h-4 text-slate-400 transition-transform duration-200', isRolesExpanded ? 'rotate-180' : '']" />
          </button>
          <div v-show="isRolesExpanded" class="px-6 pb-4 pt-1 grid grid-cols-1 lg:grid-cols-3 gap-4 animate-slide-up-fade">
            <div v-for="(role, key) in roles" :key="key" class="flex items-start gap-2.5 bg-white/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/40 p-2.5 rounded-xl">
              <span :class="['px-2 py-0.5 rounded-md text-[10px] font-bold border tracking-wide uppercase shrink-0', getRoleStyles(key)]">
                {{ role.name.split(' ')[0] }}
              </span>
              <p class="text-xs text-slate-500 dark:text-slate-400 leading-normal font-medium">
                <span class="font-bold text-slate-700 dark:text-slate-300">{{ role.name }}:</span> {{ role.description }}
              </p>
            </div>
          </div>
        </div>

        <TeamTable 
          :filtered-members="filteredMembers"
          :is-read-only="isReadOnly"
          @update-role="handleRoleChange"
          @remove-member="removeMember"
        />
      </div>
    </div>

    <InviteModal 
      :is-open="isInviteModalOpen" 
      :is-read-only="isReadOnly"
      @close="isInviteModalOpen = false"
      @submit="submitInvite"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { permissionService } from '../services/permissions.service'
import { useConfirm } from '@/composables/useConfirm'
import { Users, UserPlus, ShieldCheck, MailCheck, ChevronDown } from 'lucide-vue-next'

import TeamTable from '../components/MembersTable.vue'
import InviteModal from '../components/InviteModal.vue'
import { roles, getRoleStyles } from '../roles'
import type { Role, TeamMember } from '../types'

const route = useRoute()
const workspaceId = route.params.workspaceId as string
const { confirm } = useConfirm()

const isReadOnly = computed(() => localStorage.getItem('role') === 'read_only')

// Component States
const isLoading = ref(true)
const members = ref<TeamMember[]>([])
const isInviteModalOpen = ref(false)
const isRolesExpanded = ref(false)

// Filtering States
const searchQuery = ref('')
const statusFilter = ref<'all' | 'active' | 'pending'>('all')
const roleFilter = ref<'all' | Role>('all')

const filteredMembers = computed(() => {
  return members.value.filter(member => {
    const matchesSearch = !searchQuery.value || 
      (member.name?.toLowerCase().includes(searchQuery.value.toLowerCase())) ||
      member.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesStatus = statusFilter.value === 'all' || member.status === statusFilter.value
    const matchesRole = roleFilter.value === 'all' || member.role === roleFilter.value
    return matchesSearch && matchesStatus && matchesRole
  })
})

const clearAllFilters = () => {
  searchQuery.value = ''
  statusFilter.value = 'all'
  roleFilter.value = 'all'
}

const fetchMembers = async () => {
  isLoading.value = true
  try {
    const data = await permissionService.getMembers(workspaceId)
    members.value = data.map((m: any) => ({
      ...m,
      role: (m.role || m.role_id || 'read_only').toLowerCase() as Role,
      status: (m.status || 'pending').toLowerCase()
    }))
  } catch (error) {
    console.error('Failed to load team members:', error)
  } finally {
    isLoading.value = false
  }
}

const submitInvite = async (payload: { email: string; role: Role }) => {
  if (isReadOnly.value) return 
  try {
    const newMember = await permissionService.inviteMember(workspaceId, payload)
    members.value.push({
      ...newMember,
      role: (newMember.role || (newMember as any).role_id || 'read_only').toLowerCase() as Role,
      status: (newMember.status || 'pending').toLowerCase() as any
    })
    isInviteModalOpen.value = false
  } catch (error) {
    console.warn('Invitation process aborted.')
  }
}

const handleRoleChange = async (workspaceUserId: string, targetRole: Role, event: Event) => {
  if (isReadOnly.value) return 
  try {
    await permissionService.updateMemberRole(workspaceId, workspaceUserId, targetRole)
    const member = members.value.find(m => m.id === workspaceUserId)
    if (member) member.role = targetRole
  } catch (error) {
    const target = event.target as HTMLSelectElement
    const member = members.value.find(m => m.id === workspaceUserId)
    if (member) target.value = member.role // Revert UI
  }
}

const removeMember = async (id: string) => {
  if (isReadOnly.value) return 
  const confirmed = await confirm({
    title: 'Revoke Member Access',
    message: 'Are you sure you want to permanently remove this colleague from the workspace? They will lose access instantly.',
    confirmText: 'Revoke Access',
    cancelText: 'Nevermind',
    variant: 'danger'
  })
  if (!confirmed) return
  try {
    await permissionService.removeMember(workspaceId, id)
    members.value = members.value.filter(m => m.id !== id)
  } catch (error) {
    console.warn('Member removal aborted.')
  }
}

onMounted(() => fetchMembers())
</script>

<style scoped>
@keyframes slide-up-fade {
  0% { opacity: 0; transform: translateY(12px); }
  100% { opacity: 1; transform: translateY(0); }
}
.animate-slide-up-fade { animation: slide-up-fade 0.4s cubic-bezier(0.16, 1, 0.3, 1) both; }
</style>
