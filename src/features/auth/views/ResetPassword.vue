<!-- src/features/auth/views/ResetPassword.vue -->
<template>
  <div class="w-full">
    <!-- Header -->
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Set new password
      </h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Choose a new password for your account.
      </p>
    </div>

    <!-- Missing Token Alert -->
    <div v-if="!token" class="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
      <AlertCircle class="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
      <div class="text-sm text-slate-700 dark:text-slate-300">
        <p class="font-medium text-amber-900 dark:amber-200 mb-1">Invalid or missing token</p>
        Please use the link sent to your email address to reset your password.
      </div>
    </div>

    <!-- Reset Form -->
    <form v-else @submit.prevent class="space-y-6">
      
      <!-- Password Input -->
      <div class="space-y-1.5">
        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          New Password
        </label>
        <div class="relative flex items-center">
          <Lock class="absolute left-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            id="password" 
            v-model="form.new_password" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 font-medium transition-all duration-200" 
            placeholder="••••••••"
          >
          <button 
            type="button" 
            @click="showPassword = !showPassword" 
            tabindex="-1"
            class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-blue-500 transition-colors duration-200 cursor-pointer"
            aria-label="Toggle password visibility"
          >
            <EyeOff v-if="showPassword" class="h-5 w-5" />
            <Eye v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <!-- Confirm Password Input -->
      <div class="space-y-1.5">
        <label for="confirm_password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Confirm New Password
        </label>
        <div class="relative flex items-center">
          <Lock class="absolute left-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            id="confirm_password" 
            v-model="form.confirm_password" 
            :type="showConfirmPassword ? 'text' : 'password'" 
            required 
            class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/80 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 dark:focus:ring-blue-400/10 font-medium transition-all duration-200" 
            placeholder="••••••••"
          >
          <button 
            type="button" 
            @click="showConfirmPassword = !showConfirmPassword" 
            tabindex="-1"
            class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-blue-500 transition-colors duration-200 cursor-pointer"
            aria-label="Toggle confirm password visibility"
          >
            <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
            <Eye v-else class="h-5 w-5" />
          </button>
        </div>
      </div>

      <div class="pt-2">
        <AsyncButton 
          :action="handleSubmit" 
          class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/30 transition-all duration-200 ease-out active:scale-[0.98] cursor-pointer"
        >
          Reset Password
        </AsyncButton>
      </div>
    </form>

    <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
      Remembered your password?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-500 transition-colors duration-200">
        Sign in
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-vue-next'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { authService } from '../services/auth.service'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const { showToast } = useToast()

const token = computed(() => (route.query.token as string) || '')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  new_password: '',
  confirm_password: '',
})

const handleSubmit = async () => {
  if (form.new_password !== form.confirm_password) {
    const msg = 'Passwords do not match.'
    showToast(msg, 'error', 'Validation Error')
    throw new Error(msg)
  }

  try {
    await authService.resetPassword({
      token: token.value,
      new_password: form.new_password,
    })
    showToast('Password reset successfully! Please sign in.', 'success')
    router.push({ name: 'login' })
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password. The token may have expired.'
    showToast(errorMessage, 'error', 'Reset Failed')
    throw err
  }
}
</script>
