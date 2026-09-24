<template>
  <div class="w-full">
    
    <!-- PENDING ACTIVATION VIEW -->
    <div v-if="isPendingActivation" class="text-center space-y-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div class="mx-auto w-16 h-16 bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 rounded-full flex items-center justify-center ring-8 ring-brand-500/10">
        <MailCheck class="w-8 h-8" />
      </div>

      <div class="space-y-2">
        <h2 class="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Check your email
        </h2>
        <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          We sent an activation link to <span class="font-semibold text-slate-900 dark:text-white">{{ onboardForm.email }}</span>. Please click the link in your email to verify your account, then click the button below.
        </p>
      </div>

      <div class="p-4 bg-slate-100/70 dark:bg-slate-800/50 rounded-2xl border border-slate-200/60 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
        Didn't receive the email? Check your spam folder or wait a few minutes before trying again.
      </div>

      <div class="pt-4 max-w-sm mx-auto space-y-3">
        <button 
          type="button"
          @click="handleVerifiedClick"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-xl shadow-md shadow-brand-500/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          Verified <CheckCircle2 class="w-4 h-4" />
        </button>

        <RouterLink 
          :to="{ name: 'login' }"
          class="w-full flex items-center justify-center gap-2 py-3 px-4 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold rounded-xl transition-all active:scale-[0.98]"
        >
          <ArrowLeft class="w-4 h-4" /> Back to Sign In
        </RouterLink>
      </div>
    </div>

    <!-- ONBOARDING FORM VIEW -->
    <div v-else>
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
              <input 
                id="firstName" 
                v-model="onboardForm.first_name" 
                required 
                type="text"
                :class="[
                  'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                  errors.first_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                ]"
                placeholder="Jane" 
              />
            </div>
            <p v-if="errors.first_name" class="text-xs text-red-500 mt-1 font-medium">{{ errors.first_name }}</p>
          </div>

          <div class="space-y-1.5">
            <label for="lastName" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
            <div class="relative">
              <User class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
              <input 
                id="lastName" 
                v-model="onboardForm.last_name" 
                type="text"
                :class="[
                  'w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                  errors.last_name ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                ]"
                placeholder="Smith" 
              />
            </div>
            <p v-if="errors.last_name" class="text-xs text-red-500 mt-1 font-medium">{{ errors.last_name }}</p>
          </div>
        </div>

        <div class="space-y-1.5">
          <label for="email" class="block text-sm font-medium text-slate-700 dark:text-slate-300">Invitation Email</label>
          <div class="relative">
            <Mail class="absolute left-3 top-3 h-5 w-5 text-slate-400" />
            <input 
              id="email" 
              :value="onboardForm.email" 
              disabled 
              type="email"
              class="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/50 text-sm dark:text-slate-400 text-slate-500 cursor-not-allowed outline-none font-medium transition-all duration-200" 
            />
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
                v-model="onboardForm.password" 
                :type="showPassword ? 'text' : 'password'" 
                required
                :class="[
                  'w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border text-sm dark:text-white text-slate-900 placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:bg-white dark:focus:bg-slate-800 focus:ring-4 font-medium transition-all duration-200',
                  errors.password ? 'border-red-500 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 dark:border-slate-700/50 focus:border-brand-500 dark:focus:border-brand-400 focus:ring-brand-500/10'
                ]"
                placeholder="••••••••" 
              />
              <button type="button" @click="showPassword = !showPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer">
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
              />
              <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 focus:outline-none cursor-pointer">
                <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </div>
            <p v-if="errors.confirmPassword" class="text-xs text-red-500 mt-1 font-medium">{{ errors.confirmPassword }}</p>
          </div>
        </div>

        <div class="pt-2">
          <AsyncButton 
            :action="handleOnboardSubmit" 
            class="w-full flex justify-center items-center gap-2 py-3 px-4 rounded-xl shadow-sm text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 focus:outline-none focus:ring-4 focus:ring-brand-500/30 transition-all duration-200 ease-out active:scale-[0.98]"
          >
            Activate & Complete Setup
          </AsyncButton>
        </div>
      </form>

      <div class="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
        Wrong context or invitation link?
        <RouterLink :to="{ name: 'login' }" class="font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 transition-colors duration-200 ml-1">
          Go to log in
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { User, Mail, MailCheck, Lock, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-vue-next'
import AsyncButton from '@/components/layout/AsyncButton.vue'
import { authService } from '../services/auth.service'
import { validateAndFormatName, sanitizeEmail } from '@/utils/validation'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const route = useRoute()
const { showToast } = useToast()

const confirmPassword = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const isPendingActivation = ref(false)
const registeredWorkspaceId = ref<string | null>(null)

const onboardForm = reactive({
  email: '',
  first_name: '',
  last_name: '',
  password: ''
})

const errors = reactive({
  first_name: '',
  last_name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

// Clear specific field errors when user types in them
watch(() => onboardForm.first_name, () => { errors.first_name = '' })
watch(() => onboardForm.last_name, () => { errors.last_name = '' })
watch(() => onboardForm.password, () => { errors.password = '' })
watch(confirmPassword, () => { errors.confirmPassword = '' })

onMounted(() => {
  const queryEmail = route.query.email
  if (queryEmail && typeof queryEmail === 'string') {
    onboardForm.email = sanitizeEmail(queryEmail)
  } else {
    showToast('Missing registration email parameter. Please access via your invitation link.', 'error')
    errors.email = 'Missing registration email parameter.'
  }
})

const validateForm = (): string | null => {
  errors.first_name = ''
  errors.last_name = ''
  errors.email = ''
  errors.password = ''
  errors.confirmPassword = ''

  if (!onboardForm.email) {
    errors.email = 'Cannot submit without a valid target email address'
    return errors.email
  }

  const fn = validateAndFormatName(onboardForm.first_name, false)
  if (!fn.valid) {
    errors.first_name = fn.error!
    return fn.error!
  }
  onboardForm.first_name = fn.formatted

  if (onboardForm.last_name && onboardForm.last_name.trim()) {
    const ln = validateAndFormatName(onboardForm.last_name, true)
    if (!ln.valid) {
      errors.last_name = ln.error!
      return ln.error!
    }
    onboardForm.last_name = ln.formatted
  } else {
    onboardForm.last_name = ''
  }

  if (!onboardForm.password || onboardForm.password.length < 8) {
    errors.password = 'Password must be at least 8 characters long'
    return errors.password
  }

  if (onboardForm.password !== confirmPassword.value) {
    errors.confirmPassword = 'Passwords do not match'
    errors.password = 'Passwords do not match'
    return errors.confirmPassword
  }

  return null
}

const handleVerifiedClick = async () => {
  try {
    const loginResponse = await authService.login({
      email: onboardForm.email,
      password: onboardForm.password
    })
    const wsId = registeredWorkspaceId.value || loginResponse.workspace_id
    showToast('Verification confirmed! Welcome to your dashboard.', 'success')
    router.push({ name: 'dashboard', params: { workspaceId: wsId } })
  } catch (error: any) {
    const errorMessage = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message || 
      "An unexpected error occurred";

    const displayMessage = Array.isArray(errorMessage) 
      ? errorMessage[0].msg 
      : errorMessage

    showToast(displayMessage, "error")
  }
}

const handleOnboardSubmit = async () => {
  const validationMessage = validateForm()
  if (validationMessage) return

  try {
    const response = await authService.onboard(onboardForm)
    
    if (response.is_whitelisted) {
      showToast('Account activated successfully! Welcome to your dashboard.', 'success')
      router.push({ name: 'dashboard', params: { workspaceId: response.workspace_id } })
    } else {
      registeredWorkspaceId.value = response.workspace_id
      isPendingActivation.value = true
    }
  } catch (error: any) {
    const errorMessage = 
      error.response?.data?.detail || 
      error.response?.data?.message || 
      error.message || 
      "An unexpected error occurred";

    const displayMessage = Array.isArray(errorMessage) 
      ? errorMessage[0].msg 
      : errorMessage;

    if (Array.isArray(errorMessage)) {
      errorMessage.forEach((errObj: any) => {
        const fieldPath = errObj.loc?.[errObj.loc.length - 1];
        const msg = errObj.msg;
        if (['email'].includes(fieldPath)) { errors.email = msg; }
        else if (fieldPath === 'first_name') { errors.first_name = msg; }
        else if (fieldPath === 'last_name') { errors.last_name = msg; }
        else if (fieldPath === 'password') { errors.password = msg; }
      });
    } else {
      const lower = displayMessage.toLowerCase();
      if (lower.includes('email')) {
        errors.email = displayMessage;
      } else if (lower.includes('password')) {
        errors.password = displayMessage;
      }
    }

    showToast(displayMessage, "error");
    throw error;
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
