<template>
  <div class="w-full">
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Activate Your Account
      </h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        Set your user identity credentials to claim your pending workspace invitation.
      </p>
    </div>

    <form @submit.prevent="handleOnboardSubmit" class="space-y-6">

      <div class="grid grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="firstName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
          <div class="relative">
            <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input id="firstName" v-model="onboardForm.first_name" required type="text"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200"
              placeholder="Jane" />
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
          <div class="relative">
            <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input id="lastName" v-model="onboardForm.last_name" required type="text"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200"
              placeholder="Smith" />
          </div>
        </div>
      </div>

      <div class="space-y-1.5">
        <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Invitation Email</label>
        <div class="relative">
          <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
          <input id="email" :value="onboardForm.email" disabled type="email"
            class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-slate-400 text-slate-500 cursor-not-allowed outline-none font-medium transition-all duration-200" />
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1.5">
          <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
          <div class="relative flex items-center">
            <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
            <input id="password" v-model="onboardForm.password" :type="showPassword ? 'text' : 'password'" required
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200"
              placeholder="••••••••" />
            <button type="button" @click="showPassword = !showPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-brand-500 transition-colors duration-200">
              <EyeOff v-if="showPassword" class="h-5 w-5" />
              <Eye v-else class="h-5 w-5" />
            </button>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
          <div class="relative flex items-center">
            <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
            <input id="confirmPassword" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required
              class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200"
              placeholder="••••••••" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-brand-500 transition-colors duration-200">
              <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
              <Eye v-else class="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="validationError" class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <p class="text-sm font-medium text-red-600 dark:text-red-400">
          {{ validationError }}
        </p>
      </div>

      <div class="pt-2">
        <button
          type="submit"
          :disabled="isLoading"
          class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-out active:scale-[0.98]"
        >
          <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
          <span v-else>Activate & Complete Setup</span>
        </button>
      </div>
    </form>

    <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
      Wrong context or invitation link?
      <button @click="router.push('/auth')" class="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors duration-200 ml-1 focus:outline-none">
        Go to log in
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Loader2, User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'
import { type AuthResponse, authService } from '../services/auth.service'

const router = useRouter()
const route = useRoute()

const isLoading = ref<boolean>(false)
const validationError = ref<string>('')
const confirmPassword = ref<string>('')
const showPassword = ref<boolean>(false)
const showConfirmPassword = ref<boolean>(false)

const onboardForm = reactive({
  email: '',
  first_name: '',
  last_name: '',
  password: ''
})

onMounted(() => {
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
