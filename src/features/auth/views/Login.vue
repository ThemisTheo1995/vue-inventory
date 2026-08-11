<template>
  <div class="space-y-6">
    <div class="text-center lg:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Welcome back</h2>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700">Email</label>
        <input v-model="loginForm.email" type="email" required class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="you@company.com">
      </div>
      <div class="space-y-2">
        <label class="text-sm font-medium text-slate-700">Password</label>
        <input v-model="loginForm.password" type="password" required class="w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
      </div>

      <button type="submit" :disabled="isLoading" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.98]">
        <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
        <span v-else>Sign In</span>
      </button>
    </form>

    <div class="text-center text-sm text-slate-500 pt-6 border-t">
      Don't have an account?
      <RouterLink :to="{ name: 'register' }" class="font-semibold text-brand-600 ml-1">Sign up</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader2 } from 'lucide-vue-next'
import { authService } from '../services/auth.service'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const { showToast } = useToast()

const isLoading = ref(false)
const loginForm = reactive({ email: '', password: '' })

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const response = await authService.login(loginForm)
    showToast('Welcome back!', 'success')
    router.push({ name: 'dashboard', params: { workspaceId: response.workspace_id } })
  } catch (err: any) {
    showToast(
      err.message || 'Invalid email or password. Please try again.', 
      'error', 
      'Authentication Failed'
    )
  } finally {
    isLoading.value = false
  }
}
</script>
