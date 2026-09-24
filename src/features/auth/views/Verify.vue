<template>
  <div class="w-full text-center space-y-6">
    
    <!-- LOADING STATE -->
    <div v-if="isLoading" class="space-y-6 py-6 animate-in fade-in duration-300">
      <div class="mx-auto w-16 h-16 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center ring-8 ring-blue-500/10">
        <Loader2 class="w-8 h-8 animate-spin" />
      </div>
      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verifying account
        </h2>
        <p class="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          Please wait a moment while we confirm your activation token.
        </p>
      </div>
    </div>

    <!-- SUCCESS STATE -->
    <div v-else-if="isSuccess" class="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="mx-auto w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center ring-8 ring-emerald-500/10">
        <CheckCircle2 class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Email Verified!
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          {{ successMessage }}
        </p>
      </div>

      <div class="p-4 bg-slate-100/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        You can now close this tab or return to your main window to continue.
      </div>

      <div class="pt-2 max-w-sm mx-auto">
        <RouterLink 
          :to="{ name: 'login' }"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          Proceed to Sign In <ArrowRight class="w-4 h-4" />
        </RouterLink>
      </div>
    </div>

    <!-- ERROR STATE -->
    <div v-else-if="isError" class="space-y-6 py-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="mx-auto w-16 h-16 bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 rounded-full flex items-center justify-center ring-8 ring-rose-500/10">
        <XCircle class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Verification Failed
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          {{ errorMessage }}
        </p>
      </div>

      <div class="pt-2 max-w-sm mx-auto space-y-3">
        <RouterLink 
          :to="{ name: 'login' }"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200 active:scale-[0.98] cursor-pointer"
        >
          Back to Sign In
        </RouterLink>

        <RouterLink 
          :to="{ name: 'register' }"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all duration-200 active:scale-[0.98]"
        >
          Create New Account
        </RouterLink>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Loader2, CheckCircle2, XCircle, ArrowRight } from 'lucide-vue-next'
import { authService } from '../services/auth.service'

const route = useRoute()

const isLoading = ref(true)
const isSuccess = ref(false)
const isError = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

onMounted(async () => {
  const token = route.query.token as string

  if (!token) {
    isLoading.value = false
    isError.value = true
    errorMessage.value = 'Missing activation token in the URL.'
    return
  }

  try {
    const response = await authService.verifyEmail(token)
    isLoading.value = false
    isSuccess.value = true
    successMessage.value = response.detail || 'Account successfully verified.'
  } catch (error: any) {
    isLoading.value = false
    isError.value = true
    errorMessage.value = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      'This verification link is invalid or has expired.'
  }
})
</script>
