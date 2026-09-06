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
        
        <div v-for="step in 3" :key="step" class="relative z-10 flex flex-col items-center gap-2">
          <button 
            type="button"
            @click="jumpToStep(step)"
            class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 border-2 cursor-pointer focus:outline-none"
            :class="signupStep >= step ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/20' : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-400 hover:border-slate-300'"
          >
            {{ step }}
          </button>
        </div>
      </div>
      <div class="flex justify-between mt-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">
        <button type="button" @click="jumpToStep(1)" class="hover:text-slate-600 dark:hover:text-slate-200">Profile</button>
        <button type="button" @click="jumpToStep(2)" class="hover:text-slate-600 dark:hover:text-slate-200">Workspace</button>
        <button type="button" @click="jumpToStep(3)" class="hover:text-slate-600 dark:hover:text-slate-200">Plan</button>
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
                  <input 
                    id="firstName" 
                    v-model="form.user.first_name" 
                    required 
                    type="text" 
                    :class="[
                      'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                      errors.first_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                    ]" 
                    placeholder="John"
                  >
                </div>
                <p v-if="errors.first_name" class="text-xs text-red-500 mt-1 font-medium">{{ errors.first_name }}</p>
              </div>

              <div class="space-y-1.5">
                <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
                <div class="relative">
                  <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                  <input 
                    id="lastName" 
                    v-model="form.user.last_name" 
                    type="text" 
                    :class="[
                      'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                      errors.last_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                    ]" 
                    placeholder="Doe"
                  >
                </div>
                <p v-if="errors.last_name" class="text-xs text-red-500 mt-1 font-medium">{{ errors.last_name }}</p>
              </div>
            </div>

            <div class="space-y-1.5">
              <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  id="email" 
                  v-model="form.user.email" 
                  required 
                  type="email" 
                  :class="[
                    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                    errors.email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                  ]" 
                  placeholder="john@example.com"
                >
              </div>
              <p v-if="errors.email" class="text-xs text-red-500 mt-1 font-medium">{{ errors.email }}</p>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div class="space-y-1.5">
                <label for="password" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
                <div class="relative flex items-center">
                  <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
                  <input 
                    id="password" 
                    v-model="form.user.password" 
                    :type="showPassword ? 'text' : 'password'" 
                    required 
                    :class="[
                      'w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                      errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                    ]" 
                    placeholder="••••••••"
                  >
                  <button type="button" @click="showPassword = !showPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none">
                    <EyeOff v-if="showPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="errors.password" class="text-xs text-red-500 mt-1 font-medium">{{ errors.password }}</p>
              </div>

              <div class="space-y-1.5">
                <label for="confirmPassword" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Confirm Password</label>
                <div class="relative flex items-center">
                  <Lock class="absolute left-3 h-5 w-5 text-slate-400" />
                  <input 
                    id="confirmPassword" 
                    v-model="confirmPassword" 
                    :type="showConfirmPassword ? 'text' : 'password'" 
                    required 
                    :class="[
                      'w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                      errors.confirmPassword ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                    ]" 
                    placeholder="••••••••"
                  >
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none">
                    <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
                <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1 font-medium">{{ errors.confirmPassword }}</p>
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
                <input 
                  id="workspaceName" 
                  v-model="form.workspace.name" 
                  required 
                  type="text" 
                  :class="[
                    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                    errors.workspace_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                  ]" 
                  placeholder="Acme Corp"
                >
              </div>
              <p v-if="errors.workspace_name" class="text-xs text-red-500 mt-1 font-medium">{{ errors.workspace_name }}</p>
            </div>
            
            <div class="space-y-1.5">
              <label for="workspaceEmail" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Workspace Email</label>
              <div class="relative">
                <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                <input 
                  id="workspaceEmail" 
                  v-model="form.workspace.email" 
                  required 
                  type="email" 
                  :class="[
                    'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                    errors.workspace_email ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                  ]" 
                  placeholder="contact@acme.com"
                >
              </div>
              <p v-if="errors.workspace_email" class="text-xs text-red-500 mt-1 font-medium">{{ errors.workspace_email }}</p>
            </div>

            <div class="pt-4 flex flex-col-reverse sm:flex-row gap-3">
              <button type="button" @click="handleBackStep" class="w-full sm:w-1/3 flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none transition-all duration-200 active:scale-[0.98]">
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
              <button type="button" @click="handleBackStep" class="w-full sm:w-1/3 flex justify-center items-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 focus:outline-none transition-all duration-200 active:scale-[0.98]">
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
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Loader2, User, Mail, Lock, Building2, Eye, EyeOff } from 'lucide-vue-next'
import BillingPlans from '@/features/settings/components/BillingPlans.vue'
import { authService } from '../services/auth.service'
import { validateAndFormatName, sanitizeEmail } from '@/utils/validation'
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

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: '',
  workspace_name: '',
  workspace_email: ''
})

// Clear specific field errors when user types in them
watch(() => form.user.first_name, () => { errors.first_name = '' })
watch(() => form.user.last_name, () => { errors.last_name = '' })
watch(() => form.user.email, () => { errors.email = '' })
watch(() => form.user.password, () => { errors.password = '' })
watch(confirmPassword, () => { errors.confirmPassword = '' })
watch(() => form.workspace.name, () => { errors.workspace_name = '' })
watch(() => form.workspace.email, () => { errors.workspace_email = '' })

const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const validateStep1 = (): string | null => {
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  // 1. Validate & format First Name using utility
  const fn = validateAndFormatName(form.user.first_name, false)
  if (!fn.valid) {
    errors.first_name = fn.error!
    return fn.error!
  }
  form.user.first_name = fn.formatted

  // 2. Validate & format Last Name (if provided)
  if (form.user.last_name && form.user.last_name.trim()) {
    const ln = validateAndFormatName(form.user.last_name, true)
    if (!ln.valid) {
      errors.last_name = ln.error!
      return ln.error!
    }
    form.user.last_name = ln.formatted
  } else {
    form.user.last_name = ''
  }

  // 3. Sanitize and validate Email with robust regex to catch malformed inputs like .@example.com
  form.user.email = sanitizeEmail(form.user.email)
  if (!form.user.email || !isValidEmail(form.user.email)) {
    errors.email = 'Please enter a valid email address'
    return errors.email
  }

  // 4. Validate Password
  if (!form.user.password || form.user.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    return errors.password
  }

  if (form.user.password !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    errors.password = 'Passwords do not match'
    return errors.confirmPassword
  }

  return null
}

const validateStep2 = (): string | null => {
  errors.workspace_name = ''
  errors.workspace_email = ''

  const trimmedWsName = form.workspace.name.trim()
  if (!trimmedWsName || trimmedWsName.length < 2) {
    errors.workspace_name = 'Workspace name must be at least 2 characters long'
    return errors.workspace_name
  }
  form.workspace.name = trimmedWsName

  form.workspace.email = sanitizeEmail(form.workspace.email)
  if (!form.workspace.email || !isValidEmail(form.workspace.email)) {
    errors.workspace_email = 'Please enter a valid workspace email address'
    return errors.workspace_email
  }

  return null
}

const handleNextStep = () => {
  const validationMessage = validateStep1()
  if (validationMessage) {
    return
  }
  signupStep.value = 2
}

const handleWorkspaceStep = () => {
  const validationMessage = validateStep2()
  if (validationMessage) {
    return
  }
  signupStep.value = 3
}

const handleBackStep = () => {
  signupStep.value--
}

const jumpToStep = (targetStep: number) => {
  if (targetStep < signupStep.value) {
    signupStep.value = targetStep
    return
  }
  if (targetStep === 2) {
    const err = validateStep1()
    if (err) {
      signupStep.value = 1
      return
    }
  }
  if (targetStep === 3) {
    const err1 = validateStep1()
    if (err1) {
      signupStep.value = 1
      return
    }
    const err2 = validateStep2()
    if (err2) {
      signupStep.value = 2
      return
    }
  }
  signupStep.value = targetStep
}

const handleSubmit = async () => {
  const step1Err = validateStep1()
  if (step1Err) {
    signupStep.value = 1
    return
  }

  const step2Err = validateStep2()
  if (step2Err) {
    signupStep.value = 2
    return
  }

  isLoading.value = true
  try {
    const response = await authService.register(form)
    showToast('Registration successful! Welcome aboard.', 'success')
    router.push({ name: 'dashboard', params: { workspaceId: response.workspace_id } })
  } catch (error: any) {
    const errorMessage = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message || 
      "An unexpected error occurred";

    const displayMessage = Array.isArray(errorMessage) 
      ? errorMessage[0].msg 
      : errorMessage;

    // Handle array-based error parsing (e.g., FastAPI Pydantic details) to route back to offending step
    if (Array.isArray(errorMessage)) {
      errorMessage.forEach((errObj: any) => {
        const fieldPath = errObj.loc?.[errObj.loc.length - 1];
        const msg = errObj.msg;
        if (fieldPath === 'email' || fieldPath === 'user.email') {
          errors.email = msg;
          signupStep.value = 1;
        } else if (fieldPath === 'first_name') {
          errors.first_name = msg;
          signupStep.value = 1;
        } else if (fieldPath === 'last_name') {
          errors.last_name = msg;
          signupStep.value = 1;
        } else if (fieldPath === 'password') {
          errors.password = msg;
          signupStep.value = 1;
        } else if (fieldPath === 'name' || fieldPath === 'workspace_name') {
          errors.workspace_name = msg;
          signupStep.value = 2;
        } else if (fieldPath === 'workspace_email') {
          errors.workspace_email = msg;
          signupStep.value = 2;
        }
      });
    } else {
      const lower = displayMessage.toLowerCase();
      if (lower.includes('email') && !lower.includes('workspace')) {
        errors.email = displayMessage;
        signupStep.value = 1;
      } else if (lower.includes('workspace') || lower.includes('company')) {
        errors.workspace_name = displayMessage;
        signupStep.value = 2;
      }
    }

    showToast(displayMessage, "error");
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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
