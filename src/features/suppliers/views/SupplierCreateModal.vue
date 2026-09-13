<template>
  <BaseModal
    :is-open="isOpen"
    title="Add New Supplier"
    description="Add a new vendor or partner to your workspace"
    @close="$emit('close')"
  >
    <template #icon>
      <Users class="w-4 h-4" />
    </template>

    <form
      ref="formRef"
      class="space-y-5"
      @submit.prevent
    >
      <!-- Consolidated into a single Supplier Name field to match your backend schema -->
      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Supplier Name <span class="text-red-500">*</span>
        </label>

        <input
          v-model="form.name"
          required
          type="text"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-900 dark:text-white
                 placeholder:text-slate-400 dark:placeholder:text-slate-500
                 px-4 py-3 text-sm
                 transition
                 focus:outline-none
                 focus:ring-2
                 focus:ring-brand-500/20
                 focus:border-brand-500"
          placeholder="e.g. ACME Industrial Spares"
        />
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Email Address <span class="text-red-500">*</span>
        </label>

        <input
          v-model="form.email"
          required
          type="email"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-900 dark:text-white
                 placeholder:text-slate-400 dark:placeholder:text-slate-500
                 px-4 py-3 text-sm
                 transition
                 focus:outline-none
                 focus:ring-2
                 focus:ring-brand-500/20
                 focus:border-brand-500"
          placeholder="orders@acme.com"
        />
      </div>
    </form>

    <template #footer>
      <div class="flex items-center gap-3">
        <button
          type="button"
          @click="$emit('close')"
          class="flex-1 rounded-xl border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-700 dark:text-slate-300
                 hover:bg-slate-50 dark:hover:bg-slate-800
                 px-4 py-2.5 font-semibold transition cursor-pointer"
        >
          Cancel
        </button>

        <AsyncButton
          :action="submitSupplier"
          class="flex-1 rounded-xl bg-slate-900 dark:bg-white
                 text-white dark:text-slate-900
                 font-bold
                 px-4 py-2.5
                 hover:opacity-90
                 transition cursor-pointer flex items-center justify-center shadow-sm"
        >
          Save Supplier
        </AsyncButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Users } from "lucide-vue-next"

import BaseModal from "@/components/ui/BaseModal.vue"
import AsyncButton from "@/components/layout/AsyncButton.vue"
import { supplierService } from "../services/supplier.service"
import type { SupplierCreate } from "../types/supplier.types"
import { useToast } from "@/composables/useToast"
import { sanitizeEmail } from "@/utils/validation"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created", supplier: any): void
}>()

const { showToast } = useToast()
const formRef = ref<HTMLFormElement | null>(null)

const form = ref<SupplierCreate>({
  name: "",
  email: ""
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        name: "",
        email: ""
      }
    }
  }
)

const submitSupplier = async () => {
  if (formRef.value && !formRef.value.reportValidity()) {
    throw new Error("Validation failed")
  }

  try {
    const payload: SupplierCreate = {
      name: form.value.name,
      email: sanitizeEmail(form.value.email)
    }

    const newSupplier = await supplierService.create(props.workspaceId, payload)
    
    showToast("Supplier added successfully", "success")
    emit("created", newSupplier)
    emit("close")
  } catch (error: any) {
    if (error.message !== "Validation failed") {
      const errorMessage = 
          error.response?.data?.detail || 
          error.message || 
          "An unexpected error occurred"

      const displayMessage = Array.isArray(errorMessage) 
          ? errorMessage[0].msg 
          : errorMessage

      showToast(displayMessage, "error")
    }
    throw error
  }
}
</script>
