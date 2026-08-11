<template>
  <div class="space-y-6">
    
    <div class="text-center lg:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
        Activate Your Account
      </h2>
      <p class="mt-2 text-sm text-slate-500">
        Set your user identity credentials to claim your pending workspace invitation.
      </p>
    </div>

    <form @submit.prevent="handleOnboardSubmit" class="space-y-5">

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">First Name</label>
          <input v-model="onboardForm.first_name" required type="text"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="Jane" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Last Name</label>
          <input v-model="onboardForm.last_name" required type="text"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="Smith" />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-400">Invitation Email Address</label>
        <input :value="onboardForm.email" disabled type="email"
          class="w-full px-4 py-3 bg-slate-100/80 border text-slate-400 rounded-xl cursor-not-allowed" />
      </div>

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Password</label>
          <input v-model="onboardForm.password" required type="password"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="••••••••" />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-medium text-slate-700">Confirm Password</label>
          <input v-model="confirmPassword" required type="password"
            class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all"
            placeholder="••••••••" />
        </div>
      </div>

      <p v-if="validationError" class="text-sm text-red-500">
        {{ validationError }}
      </p>

      <button
        type="submit"
        :disabled="isLoading"
        class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]"
      >
        <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
        <span v-else>Activate & Complete Setup</span>
      </button>
    </form>

    <div class="text-center text-sm text-slate-500 pt-6 border-t">
      Wrong context or invitation link?
      <button @click="router.push('/auth')" class="font-semibold text-brand-600 ml-1">
        Go to log in
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { type AuthResponse, authService } from '../services/auth.service'

const router = useRouter()
const route = useRoute()

const isLoading = ref<boolean>(false)
const validationError = ref<string>('')
const confirmPassword = ref<string>('')

const onboardForm = reactive({
  email: '',
  first_name: '',
  last_name: '',
  password: ''
})

onMounted(() => {
  // Extracting the target user invitation email from route query parameter (e.g., ?email=invited@corp.com)
  const queryEmail = route.query.email
  if (queryEmail && typeof queryEmail === 'string') {
    onboardForm.email = queryEmail
  } else {
    validationError.value = 'Missing registration email parameter. Please access via your invitation link.'
  }
})

const handleOnboardSubmit = async () => {
  if (!onboardForm.email) {
    validationError.value = 'Cannot submit form without a valid verification target email.'
    return
  }

  if (onboardForm.password !== confirmPassword.value) {
    validationError.value = 'Passwords do not match'
    return
  }

  if (onboardForm.password.length < 8) {
    validationError.value = 'Password must be at least 8 characters long'
    return
  }

  validationError.value = ''
  isLoading.value = true

  try {
  
    const response: AuthResponse = await authService.onboard(onboardForm)

    router.push({ 
      name: 'dashboard', 
      params: { workspaceId: response.workspace_id } 
    })
  } catch (err: any) {
    validationError.value = err.message || 'An unexpected onboarding exception occurred. Please try again.'
    console.error('Authentication process failed.')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* --- NEW: Pipeline CSS Animations --- */
/* The dasharray length represents the visible segment (data) and the hidden segment (gap).
   Offsetting it negatively pushes the data "forward" along the path. */

.pipe-flow-1 { animation: flow-1 4s linear infinite; } 
@keyframes flow-1 { to { stroke-dashoffset: -200; } } /* 40 + 160 = 200 total length */

.pipe-flow-2 { animation: flow-2 5s linear infinite; } 
@keyframes flow-2 { to { stroke-dashoffset: -200; } } /* 40 + 160 = 200 total length */

/* Sending data backwards along the track for variety */
.pipe-flow-3 { animation: flow-3 6s linear infinite; } 
@keyframes flow-3 { to { stroke-dashoffset: 260; } } /* 60 + 200 = 260 total length */

.pipe-flow-4 { animation: flow-4 4.5s linear infinite; } 
@keyframes flow-4 { to { stroke-dashoffset: -180; } } /* 30 + 150 = 180 total length */

.pipe-flow-5 { animation: flow-5 3.5s linear infinite; } 
@keyframes flow-5 { to { stroke-dashoffset: -200; } } /* 50 + 150 = 200 total length */
</style>
