<template>
  <div class="p-6 max-w-5xl mx-auto">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-slate-900 dark:text-white">Workspace Settings</h1>
      <p class="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage your company contact details and address.</p>
    </div>

    <div v-if="isLoading" class="animate-pulse space-y-4">
      <div class="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-2xl w-full max-w-3xl"></div>
    </div>

    <div v-else-if="!isValidId" class="p-4 bg-red-50 text-red-600 rounded-xl max-w-3xl border border-red-100">
      <p class="font-medium">Error: Invalid Workspace ID in URL.</p>
    </div>

    <div v-else class="bg-white dark:bg-slate-800/80 border border-slate-200/70 dark:border-slate-700/70 rounded-2xl p-6 shadow-sm max-w-3xl">
      <div class="space-y-5">
        
        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Company Name</label>
          <div class="relative flex items-center group">
            <input 
              type="text" 
              v-model="form.name" 
              :disabled="!editStates.name"
              placeholder="e.g. EliteDealsUK"
              :class="[inputBaseClass, editStates.name ? inputEditClass : inputReadClass]" 
            />
            <button 
              v-if="!isReadOnly"
              @click="toggleEdit('name')"
              :class="[btnBaseClass, editStates.name ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200']"
            >
              <Check v-if="editStates.name" class="w-4 h-4" />
              <Pencil v-else class="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Support Email</label>
            <div class="relative flex items-center group">
              <input 
                type="email" 
                v-model="form.email" 
                :disabled="!editStates.email"
                placeholder="e.g. support@elitedeals.co.uk"
                :class="[inputBaseClass, editStates.email ? inputEditClass : inputReadClass]" 
              />
              <button v-if="!isReadOnly" @click="toggleEdit('email')" :class="[btnBaseClass, editStates.email ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
                <Check v-if="editStates.email" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Phone Number</label>
            <div class="relative flex items-center group">
              <input 
                type="tel" 
                v-model="form.phone_number" 
                :disabled="!editStates.phone_number"
                placeholder="e.g. +447700900077"
                :class="[inputBaseClass, editStates.phone_number ? inputEditClass : inputReadClass]" 
              />
              <button v-if="!isReadOnly" @click="toggleEdit('phone_number')" :class="[btnBaseClass, editStates.phone_number ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
                <Check v-if="editStates.phone_number" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <hr class="border-slate-100 dark:border-slate-700/60 my-2" />

        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Address Line 1</label>
          <div class="relative flex items-center group">
            <input 
              type="text" 
              v-model="form.address_line1" 
              :disabled="!editStates.address_line1"
              placeholder="e.g. 102 Business Park"
              :class="[inputBaseClass, editStates.address_line1 ? inputEditClass : inputReadClass]" 
            />
            <button v-if="!isReadOnly" @click="toggleEdit('address_line1')" :class="[btnBaseClass, editStates.address_line1 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
              <Check v-if="editStates.address_line1" class="w-4 h-4" />
              <Pencil v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Address Line 2 (Optional)</label>
          <div class="relative flex items-center group">
            <input 
              type="text" 
              v-model="form.address_line2" 
              :disabled="!editStates.address_line2"
              placeholder="e.g. Suite 4B"
              :class="[inputBaseClass, editStates.address_line2 ? inputEditClass : inputReadClass]" 
            />
            <button v-if="!isReadOnly" @click="toggleEdit('address_line2')" :class="[btnBaseClass, editStates.address_line2 ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
              <Check v-if="editStates.address_line2" class="w-4 h-4" />
              <Pencil v-else class="w-4 h-4" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">City</label>
            <div class="relative flex items-center group">
              <input 
                type="text" 
                v-model="form.city" 
                :disabled="!editStates.city"
                placeholder="e.g. London"
                :class="[inputBaseClass, editStates.city ? inputEditClass : inputReadClass]" 
              />
              <button v-if="!isReadOnly" @click="toggleEdit('city')" :class="[btnBaseClass, editStates.city ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
                <Check v-if="editStates.city" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Postal Code</label>
            <div class="relative flex items-center group">
              <input 
                type="text" 
                v-model="form.postal_code" 
                :disabled="!editStates.postal_code"
                placeholder="e.g. E1 6AN"
                :class="[inputBaseClass, editStates.postal_code ? inputEditClass : inputReadClass]" 
              />
              <button v-if="!isReadOnly" @click="toggleEdit('postal_code')" :class="[btnBaseClass, editStates.postal_code ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
                <Check v-if="editStates.postal_code" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-600 dark:text-slate-300">Country</label>
            <div class="relative flex items-center group">
              <input 
                type="text" 
                v-model="form.country" 
                :disabled="!editStates.country"
                placeholder="e.g. United Kingdom"
                :class="[inputBaseClass, editStates.country ? inputEditClass : inputReadClass]" 
              />
              <button v-if="!isReadOnly" @click="toggleEdit('country')" :class="[btnBaseClass, editStates.country ? 'text-slate-700 dark:text-slate-200' : 'text-slate-400']">
                <Check v-if="editStates.country" class="w-4 h-4" />
                <Pencil v-else class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { Pencil, Check } from 'lucide-vue-next'

import { workspaceContactService } from '../services/contact.service' 
import type { WorkspaceContact } from '../types'

const isReadOnly = computed(() => {
  return localStorage.getItem('role') === 'read_only' 
})

const route = useRoute()
const isLoading = ref(true)

const routeId = Array.isArray(route.params.workspaceId) ? route.params.workspaceId[0] : route.params.workspaceId

// Computed property that strictly checks against missing data or the literal string "undefined"
const isValidId = computed(() => {
  return typeof routeId === 'string' && routeId.trim() !== '' && routeId !== 'undefined'
})

const form = ref<WorkspaceContact>({
  id: '',
  name: '',
  email: null,
  phone_number: null,
  address_line1: null,
  address_line2: null,
  city: null,
  postal_code: null,
  country: null
})

const editStates = ref({
  name: false,
  email: false,
  phone_number: false,
  address_line1: false,
  address_line2: false,
  city: false,
  postal_code: false,
  country: false
})

onMounted(async () => {
  try {
    const data = await workspaceContactService.getWorkspaceContact(routeId as string)
    form.value = { ...form.value, ...data }
  } catch (error) {
    console.error('Failed to load workspace data:', error)
  } finally {
    isLoading.value = false
  }
})

const toggleEdit = async (field: keyof typeof editStates.value) => {
  if (isReadOnly.value) return

  if (editStates.value[field]) {
    try {
      await workspaceContactService.updateWorkspaceContact(routeId as string, {
        [field]: form.value[field]
      })
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
