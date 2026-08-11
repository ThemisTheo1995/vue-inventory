<template>
  <div class="space-y-6">
    <div class="text-center lg:text-left">
      <h2 class="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">Create an account</h2>
      
      <div class="flex gap-2 mt-4">
        <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep >= 1 ? 'bg-brand-600' : 'bg-slate-200'"></div>
        <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep >= 2 ? 'bg-brand-600' : 'bg-slate-200'"></div>
        <div class="h-1 flex-1 rounded-full transition-all duration-500" :class="signupStep === 3 ? 'bg-brand-600' : 'bg-slate-200'"></div>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-5">
      <Transition name="step-slide" mode="out-in">
        <div :key="signupStep" class="space-y-5">
          
          <div v-if="signupStep === 1" class="space-y-5">
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
                <input v-model="form.user.first_name" required type="text" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="John">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <input v-model="form.user.last_name" required type="text" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Doe">
              </div>
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Email</label>
              <input v-model="form.user.email" required type="email" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="john@example.com">
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <input v-model="form.user.password" required type="password" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <input v-model="confirmPassword" required type="password" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="••••••••">
              </div>
            </div>

            <button type="button" @click="handleNextStep" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.99]">
              Continue to Workspace Details <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <div v-else-if="signupStep === 2" class="space-y-5">
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Name</label>
              <input v-model="form.workspace.name" required type="text" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="Acme Corp">
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Email</label>
              <input v-model="form.workspace.email" required type="email" class="w-full px-4 py-3 border border-slate-200 dark:border-slate-800 dark:bg-slate-950 dark:text-white rounded-xl focus:ring-2 focus:ring-brand-500 outline-none transition-all" placeholder="contact@acme.com">
            </div>

            <button type="button" @click="handleWorkspaceStep" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.99]">
              Continue to Plan Selection <ArrowRight class="w-4 h-4" />
            </button>
          </div>

          <div v-else-if="signupStep === 3" class="space-y-5">
            <label class="text-sm font-medium text-slate-700 dark:text-slate-300 block">Select your Product Tier</label>
            
            <BillingPlans v-model="form.plan" />

            <button type="submit" :disabled="isLoading" class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl transition-all active:scale-[0.99] disabled:opacity-50">
              <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
              <span v-else>Complete Registration</span>
            </button>
          </div>

        </div>
      </Transition>

      <button v-if="signupStep > 1" type="button" @click="handleBackStep" class="w-full py-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 transition-colors mt-2">
        &larr; Back to {{ signupStep === 3 ? 'Workspace Details' : 'Personal Details' }}
      </button>
    </form>

    <div class="text-center text-sm text-slate-500 pt-6 border-t border-slate-100 dark:border-slate-800">
      Already have an account?
      <RouterLink :to="{ name: 'login' }" class="font-semibold text-brand-600 ml-1 hover:text-brand-700">Sign in</RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Loader2 } from 'lucide-vue-next'
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
    showToast(err.message || 'An unexpected verification error occurred during registration.', 'error', 'Registration Failed')
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Step Transition Timings ONLY - Removed all the error alert CSS */
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
