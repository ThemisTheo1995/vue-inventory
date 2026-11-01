<!-- src/views/bins/BinCreateModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Add New Bin"
    description="Add a new warehouse bin location or zone"
    @close="$emit('close')"
  >
    <template #icon>
      <Box class="w-4 h-4" />
    </template>

    <form
      id="create-bin-form"
      class="space-y-5"
      @submit.prevent="submitBin"
    >
      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Bin Code <span class="text-red-500">*</span>
        </label>

        <input
          v-model="form.code"
          required
          type="text"
          class="w-full rounded-xl border border-slate-200 dark:border-slate-700
                 bg-white dark:bg-slate-900
                 text-slate-900 dark:text-white
                 placeholder:text-slate-400 dark:placeholder:text-slate-500
                 px-4 py-3 text-sm uppercase
                 transition
                 focus:outline-none
                 focus:ring-2
                 focus:ring-brand-500/20
                 focus:border-brand-500"
          placeholder="e.g. A-01-03"
        />
      </div>

      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Zone <span class="text-slate-400 font-normal">(Optional)</span>
        </label>

        <input
          v-model="form.zone"
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
          placeholder="e.g. Warehouse A"
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
          :action="submitBin"
          class="flex-1 rounded-xl bg-slate-900 dark:bg-white
                 text-white dark:text-slate-900
                 font-bold
                 px-4 py-2.5
                 hover:opacity-90
                 transition"
        >
          Save Bin
        </AsyncButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Box } from "lucide-vue-next"
import AsyncButton from "@/components/layout/AsyncButton.vue"

import BaseModal from "@/components/ui/BaseModal.vue"
import { binService } from "../services/bin.service.ts"
import type { BinCreate } from "../types/bin.types"
import { useToast } from "@/composables/useToast"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created", bin: any): void
}>()

const { showToast } = useToast()

const form = ref<BinCreate>({
  code: "",
  zone: ""
})

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        code: "",
        zone: ""
      }
    }
  }
)

const submitBin = async () => {
  const formEl = document.getElementById("create-bin-form") as HTMLFormElement
  if (formEl && !formEl.checkValidity()) {
    formEl.reportValidity()
    return
  }

  // Normalize code to uppercase & handle optional zone strings properly
  const payload: BinCreate = {
    code: form.value.code.trim().toUpperCase(),
    zone: form.value.zone?.trim() ? form.value.zone.trim() : null
  }

  try {
    const newBin = await binService.createBin(props.workspaceId, payload)
    
    showToast("Bin created successfully", "success")
    emit("created", newBin)
    emit("close")
  } catch (error: any) {
    const errorMessage = 
        error.response?.data?.detail || 
        error.message || 
        "An unexpected error occurred"

    const displayMessage = Array.isArray(errorMessage) 
        ? errorMessage[0].msg 
        : errorMessage

    showToast(displayMessage, "error")
  }
};
</script>
