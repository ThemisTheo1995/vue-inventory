<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">User Profile</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage personal information and contact details.</p>
    </div>

    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full max-w-3xl"></div>
    </div>

    <div v-else-if="!currentUser" class="p-4 bg-red-50 text-red-600 rounded-xl max-w-3xl border border-red-100">
      <p class="font-medium">Error: User authentication data not found.</p>
    </div>

    <div v-else class="bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm max-w-3xl">
      <div class="space-y-5">
        
        <!-- Name Row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">First Name</label>
            <div class="relative flex items-center group">
              <input 
                type="text" 
                v-model="form.first_name" 
                :disabled="!editStates.first_name"
                placeholder="e.g. Jane"
                :class="[inputBaseClass, editStates.first_name ? inputEditClass : inputReadClass]" 
              />
              <button 
                v-if="!isReadOnly"
                @click="toggleEdit('first_name')"
                :class="[btnBaseClass, editStates.first_name ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200']"
              >
                <Check v-if="editStates.first_name" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Last Name</label>
            <div class="relative flex items-center group">
              <input 
                type="text" 
                v-model="form.last_name" 
                :disabled="!editStates.last_name"
                placeholder="e.g. Doe"
                :class="[inputBaseClass, editStates.last_name ? inputEditClass : inputReadClass]" 
              />
              <button 
                v-if="!isReadOnly"
                @click="toggleEdit('last_name')"
                :class="[btnBaseClass, editStates.last_name ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200']"
              >
                <Check v-if="editStates.last_name" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <!-- Email Row -->
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Email Address</label>
          <div class="relative flex items-center group">
            <input 
              type="email" 
              v-model="form.email" 
              :disabled="!editStates.email"
              placeholder="e.g. jane.doe@company.com"
              :class="[inputBaseClass, editStates.email ? inputEditClass : inputReadClass]" 
            />
            <button 
              v-if="!isReadOnly" 
              @click="toggleEdit('email')" 
              :class="[btnBaseClass, editStates.email ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200']"
            >
              <Check v-if="editStates.email" class="w-4 h-4" />
              <Pencil v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Pencil, Check } from 'lucide-vue-next'
import { useRoute } from 'vue-router'

import { useAuthStore } from '@/features/auth/services/auth.store'
import { userService } from '../services/user.services' 
import type { User, UserUpdate } from '../types/user.types'

const route = useRoute()
const authStore = useAuthStore()
const { user: currentUser } = storeToRefs(authStore)

const isLoading = ref(true)
const isReadOnly = computed(() => currentUser.value?.role === 'read_only')

const form = ref<User>({
  id: '',
  first_name: '',
  last_name: '',
  email: ''
})

type EditableField = keyof UserUpdate

const editStates = ref<Record<EditableField, boolean>>({
  first_name: false,
  last_name: false,
  email: false
})

// Keep local form in sync with Pinia state automatically
watchEffect(() => {
  if (currentUser.value) {
    form.value = {
      id: currentUser.value.id,
      first_name: currentUser.value.first_name,
      last_name: currentUser.value.last_name,
      email: currentUser.value.email
    }
    isLoading.value = false
  }
})

const toggleEdit = async (field: EditableField) => {
  if (isReadOnly.value || !currentUser.value) return

  if (editStates.value[field]) {
    try {
      const workspaceId = (route.params.workspaceId as string) || currentUser.value.workspace_id

      if (!workspaceId) throw new Error('No workspace context found')

      const updatedUser = await userService.updateUser(workspaceId, {
        [field]: form.value[field],
      })

      authStore.updateUserData(updatedUser)
    } catch (error) {
      console.error(`Failed to update ${field}:`, error)
      return
    }
  }

  editStates.value[field] = !editStates.value[field]
}

// Styling Classes
const inputBaseClass = 'w-full rounded-xl border px-4 py-3 pr-12 outline-none transition-all duration-200 text-sm font-medium placeholder-slate-400/80 dark:placeholder-slate-500'
const inputEditClass = 'border-slate-300 dark:border-slate-600 bg-transparent focus:ring-4 focus:ring-slate-500/5 focus:border-slate-400 dark:focus:border-slate-500 text-slate-900 dark:text-white shadow-sm'
const inputReadClass = 'border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30 text-slate-500 dark:text-slate-400 cursor-not-allowed select-none'
const btnBaseClass = 'absolute right-3 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors duration-200'
</script>
