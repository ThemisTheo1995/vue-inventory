<template>
  <div class="w-full">
    <div class="mb-8">
      <h2 class="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
        Create an account
      </h2>
      <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
        {{ signupStep === 1 ? 'Let\'s start with your personal details.' : signupStep === 2 ? 'Set up your workspace environment.' : 'Select a plan to complete registration.' }}
      </p>
    </div>

    <!-- Stepper Progress -->
    <div class="mb-8">
      <div class="flex items-center justify-between relative">
        <div class="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-100 dark:bg-slate-800 rounded-full z-0"></div>
        <div class="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-brand-600 transition-all duration-500 rounded-full z-0" :style="{ width: `${((signupStep - 1) / 2) * 100}%` }"></div>
        
        <!-- Removed bg-white dark:bg-slate-950 px-2 to eliminate the rectangular white background boxes -->
        <div v-for="step in 3" :key="step" class="relative z-10 flex flex-col items-center gap-2">
          <div 
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2"
            :class="signupStep >= step ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400'"
          >
            {{ step }}
          </div>
        </div>
      </div>
      <div class="flex justify-between mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <span>Profile</span>
        <span>Workspace</span>
        <span>Plan</span>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      <Transition name="step-slide" mode="out-in">
        <div :key="signupStep">
          
          <!-- STEP 1 -->
          <div v-if="signupStep === 1" class="space-y-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="firstName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <div class="relative">
                  <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input id="firstName" v-model="form.user.first_name" required type="text" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="John">
                </div>
              </div>
              <div class="space-y-1.5">
                <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <div class="relative">
                  <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input id="lastName" v-model="form.user.last_name" required type="text" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="Doe">
                </div>
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input id="email" v-model="form.user.email" required type="email" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="john@example.com">
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div class="relative flex items-center">
                  <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
                  <input id="password" v-model="form.user.password" :type="showPassword ? 'text' : 'password'" required class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="••••••••">
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-brand-500 transition-colors duration-200">
                    <EyeOff v-if="showPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="space-y-1.5">
                <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm</label>
                <div class="relative flex items-center">
                  <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
                  <input id="confirmPassword" v-model="confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" required class="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="••••••••">
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none focus:text-brand-500 transition-colors duration-200">
                    <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-4">
              <button type="button" @click="handleNextStep" class="group w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all duration-200 ease-out active:scale-[0.98]">
                Continue to Workspace 
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <!-- STEP 2 -->
          <div v-else-if="signupStep === 2" class="space-y-4">
            <div class="space-y-1.5">
              <label for="workspaceName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Name</label>
              <div class="relative">
                <Building2 class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input id="workspaceName" v-model="form.workspace.name" required type="text" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="Acme Corp">
              </div>
            </div>
            
            <div class="space-y-1.5">
              <label for="workspaceEmail" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input id="workspaceEmail" v-model="form.workspace.email" required type="email" class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-4 focus:ring-brand-500/10 dark:focus:ring-brand-400/10 font-medium transition-all duration-200" placeholder="contact@acme.com">
              </div>
            </div>

            <div class="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" @click="handleBackStep" class="w-full sm:w-1/3 flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/10 transition-all duration-200 ease-out active:scale-[0.98]">
                Back
              </button>
              <button type="button" @click="handleWorkspaceStep" class="group w-full sm:w-2/3 flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all duration-200 ease-out active:scale-[0.98]">
                Choose Plan 
                <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
              </button>
            </div>
          </div>

          <!-- STEP 3 -->
          <div v-else-if="signupStep === 3" class="space-y-6">
            <BillingPlans v-model="form.plan" />

            <div class="pt-2 flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" @click="handleBackStep" class="w-full sm:w-1/3 flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-500/10 transition-all duration-200 ease-out active:scale-[0.98]">
                Back
              </button>
              <button type="submit" :disabled="isLoading" class="w-full sm:w-2/3 flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-200 ease-out active:scale-[0.98]">
                <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
                <span v-else>Complete Registration</span>
              </button>
            </div>
          </div>

        </div>
      </Transition>
    </form>

    <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors duration-200">
        Sign in instead
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Loader2, User, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-vue-next'
import BillingPlans from '@/features/settings/components/BillingPlans.vue'
import { authService } from '../services/auth.service'
import { authValidationService } from '../services/auth-validation.service'
import { useToast } from '@/composables/useToast'
import type { PricingPlan } from '../types'

const router = useRouter()
const { showToast } = useToast()

const signupStep = ref(1)
const isLoading = ref(false)
const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  user: { first_name: '', last_name: '', email: '', password: '' },
  workspace: { name: '', email: '' },
  plan: 'growth' as PricingPlan
})

const handleNextStep = () => {
  const validationMessage = authValidationService.validatePersonalDetails(form.user, confirmPassword.value)
  if (validationMessage) {
    showToast(validationMessage, 'error', 'Invalid Details')
    return
  }
  signupStep.value = 2
}

const handleWorkspaceStep = () => {
  const validationMessage = authValidationService.validateWorkspaceDetails(form.workspace)
  if (validationMessage) {
    showToast(validationMessage, 'error', 'Invalid Workspace')
    return
  }
  signupStep.value = 3
}

const handleBackStep = () => {
  signupStep.value--
}

const handleSubmit = async () => {
  if (signupStep.value === 1) {
    handleNextStep()
    return
  }
  if (signupStep.value === 2) {
    handleWorkspaceStep()
    return
  }

  const step1Error = authValidationService.validatePersonalDetails(form.user, confirmPassword.value)
  const step2Error = authValidationService.validateWorkspaceDetails(form.workspace)
  
  if (step1Error || step2Error) {
    showToast(step1Error || step2Error || 'Validation processing error.', 'error')
    return
  }

  isLoading.value = true
  try {
    const response = await authService.register(form)
    showToast('Registration successful! Welcome aboard.', 'success')
    router.push({ name: 'dashboard', params: { workspaceId: response.workspace_id } })
  } catch (err: any) {
    const errorMessage = err.response?.data?.message || err.message || 'An unexpected verification error occurred during registration.'
    showToast(errorMessage, 'error', 'Registration Failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.step-slide-enter-active,
.step-slide-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.step-slide-enter-from {
  opacity: 0;
  transform: translateX(12px);
}
.step-slide-leave-to {
  opacity: 0;
  transform: translateX(-12px);
}
</style>
