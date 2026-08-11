<template>
  <BaseModal
    :is-open="isOpen"
    title="Add New Customer"
    description="Add a new client to your workspace"
    @close="$emit('close')"
  >
    <template #icon>
      <Users class="w-4 h-4" />
    </template>

    <form
      id="create-customer-form"
      class="space-y-5"
      @submit.prevent="submitCustomer"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            First Name <span class="text-red-500">*</span>
          </label>

          <input
            v-model="form.first_name"
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
            placeholder="John"
          />
        </div>

        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Last Name
          </label>

          <input
            v-model="form.last_name"
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
              placeholder="Doe"
          />
        </div>
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Email <span class="text-red-500">*</span>
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
          placeholder="email@example.com"
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
                 px-4 py-2.5 font-semibold transition"
        >
          Cancel
        </button>

        <button
          type="submit"
          form="create-customer-form"
          :disabled="isSubmitting"
          class="flex-1 rounded-xl bg-slate-900 dark:bg-white
                 text-white dark:text-slate-900
                 font-bold
                 px-4 py-2.5
                 hover:opacity-90
                 disabled:opacity-60
                 disabled:cursor-not-allowed
                 transition"
        >
          {{ isSubmitting ? "Saving..." : "Save Customer" }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Users } from "lucide-vue-next"

import BaseModal from "@/components/ui/BaseModal.vue"
import { customerService } from "../services/customer.service"
import type { CustomerCreate } from "../types/customer.types"
import { useToast } from "@/composables/useToast"
import { validateCustomerData } from "@/utils/validation"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created", customer: any): void
}>()

const { showToast } = useToast()

const isSubmitting = ref(false)

const form = ref<CustomerCreate>({
  first_name: "",
  last_name: "",
  email: ""
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        first_name: "",
        last_name: "",
        email: ""
      }
    }
  }
)


const submitCustomer = async () => {
  const validation = validateCustomerData({
    first_name: form.value.first_name,
    last_name: form.value.last_name,
    email: form.value.email
  });

  if (!validation.isValid) {
    validation.errors.forEach(err => showToast(err, "error"));
    return;
  }

  try {
    isSubmitting.value = true;

    const newCustomer = await customerService.create(props.workspaceId, validation.sanitizedData);
    
    showToast("Customer added successfully", "success");
    emit("created", newCustomer);
    emit("close");
  } catch (error: any) {
    const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        "An unexpected error occurred";

    const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage;

    showToast(displayMessage, "error")
  } finally {
    isSubmitting.value = false;
  }
};
</script>
