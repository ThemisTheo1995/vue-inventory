<!-- src/features/auth/views/RequestPassword.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Reset password
      </h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Enter your account email and we'll send you a password reset link.
      </p>
    </div>

    <!-- Confirmation State -->
    <div v-if="emailSent" class="space-y-6">
      <div class="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 flex items-start gap-3">
        <CheckCircle2 class="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
        <div class="text-sm text-slate-700 dark:text-slate-300">
          <p class="font-medium text-slate-900 dark:text-white mb-1">Check your inbox</p>
          We sent a reset link to <span class="font-semibold text-slate-900 dark:text-white">{{ email }}</span> if an account exists under that email.
        </div>
      </div>

      <div class="pt-2 flex flex-col gap-3">
        <button
          type="button"
          @click="emailSent = false"
          class="w-full py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors duration-200 cursor-pointer"
        >
          Didn't receive an email? Try again
        </button>

        <RouterLink 
          :to="{ name: 'login' }"
          class="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to login
        </RouterLink>
      </div>
    </div>

    <!-- Request Form -->
    <form v-else @submit.prevent class="space-y-6">
      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <div class="relative">
          <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            id="email" 
            v-model="email" 
            type="email" 
            required 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 font-medium transition-all duration-200" 
            placeholder="you@company.com"
          >
        </div>
      </div>

      <div class="pt-2">
        <AsyncButton 
          :action="handleSubmit" 
          class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 ease-out active:scale-[0.98] cursor-pointer"
        >
          Send Reset Link
        </AsyncButton>
      </div>

      <div class="text-center pt-2">
        <RouterLink 
          :to="{ name: 'login' }"
          class="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors duration-200"
        >
          <ArrowLeft class="h-4 w-4" />
          Back to login
        </RouterLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-vue-next'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { authService } from '../services/auth.service'
import { useToast } from '@/composables/useToast'

const { showToast } = useToast()

const email = ref('')
const emailSent = ref(false)

const handleSubmit = async () => {
  try {
    await authService.requestPasswordReset(email.value)
    emailSent.value = true
    
    // Duration set to 300,000 ms (5 minutes)
    showToast(
      'Reset link requested! You have 5 minutes to complete this process.', 
      'success', 
      'Reset Requested', 
      300000
    )
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to request password reset. Please try again.'
    showToast(errorMessage, 'error', 'Request Failed')
    throw err
  }
}
</script>
