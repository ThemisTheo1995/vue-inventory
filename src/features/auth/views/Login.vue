<template>
  <div class="w-full">
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Welcome back
      </h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Please sign in to your account
      </p>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- Email Input -->
      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Email address
        </label>
        <div class="relative">
          <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            id="email" 
            v-model="loginForm.email" 
            type="email" 
            required 
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" 
            placeholder="you@company.com"
          >
        </div>
      </div>

      <!-- Password Input -->
      <div class="space-y-1.5">
        <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Password
        </label>
        <div class="relative flex items-center">
          <Lock class="absolute left-3 h-5 w-5 text-slate-400 dark:text-slate-500" />
          <input 
            id="password" 
            v-model="loginForm.password" 
            :type="showPassword ? 'text' : 'password'" 
            required 
            class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/60 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" 
            placeholder="••••••••"
          >
          <!-- tabindex="-1" skips the eye toggle button during keyboard tabbing -->
          <button 
            type="button" 
            @click="showPassword = !showPassword" 
            tabindex="-1"
            class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-brand-500 transition-colors duration-200"
            aria-label="Toggle password visibility"
          >
            <EyeOff v-if="showPassword" class="h-5 w-5" />
            <Eye v-else class="h-5 w-5" />
          </button>
        </div>
        
        <!-- tabindex="-1" skips this link during keyboard tabbing -->
        <div class="flex justify-end pt-1">
          <a href="#" tabindex="-1" class="text-sm font-medium text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors duration-200">
            Forgot your password?
          </a>
        </div>
      </div>

      <div class="pt-2">
        <button 
          type="submit" 
          :disabled="isLoading" 
          class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-out active:scale-[0.98]"
        >
          <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
          <span v-else>Sign In</span>
        </button>
      </div>
    </form>

    <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors duration-200">
        Sign up for free
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { authService } from '../services/auth.service'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const isLoading = ref(false)
const showPassword = ref(false)
const loginForm = reactive({ email: '', password: '' })

let mediaQuery: MediaQueryList | null = null

const handleSystemThemeChange = (e: MediaQueryListEvent | MediaQueryList) => {
  const isDark = e.matches
  if (localStorage.getItem('theme') === 'system') {
    document.documentElement.classList.toggle('dark', isDark)
  }
}

onMounted(() => {
  mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
  mediaQuery.addEventListener('change', handleSystemThemeChange)
})

onUnmounted(() => {
  if (mediaQuery) {
    mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }
})

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const response = await authService.login(loginForm)
    showToast('Welcome back!', 'success')
    router.push({ name: 'dashboard', params: { workspaceId: response.workspace_id } })
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'Invalid email or password. Please try again.'
    showToast(
      errorMessage, 
      'error', 
      'Authentication Failed'
    )
  } finally {
    isLoading.value = false
  }
}
</script>
