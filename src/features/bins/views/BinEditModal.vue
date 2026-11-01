<!-- src/views/bins/BinEditModal.vue -->
<template>
  <BaseModal
    :is-open="isOpen"
    title="Edit Bin Location"
    description="Update warehouse bin code or zone details"
    @close="$emit('close')"
  >
    <template #icon>
      <Box class="w-4 h-4" />
    </template>

    <form
      id="edit-bin-form"
      class="space-y-5"
      @submit.prevent="submitEdit"
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
          :action="submitEdit"
          class="flex-1 rounded-xl bg-slate-900 dark:bg-white
                 text-white dark:text-slate-900
                 font-bold
                 px-4 py-2.5
                 hover:opacity-90
                 transition"
        >
          Save Changes
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
import { binService } from "../services/bin.service"
import type { Bin, BinUpdate } from "../types/bin.types"
import { useToast } from "@/composables/useToast"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
  bin: Bin
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "updated", bin: Bin): void
}>()

const { showToast } = useToast()

const form = ref<BinUpdate>({
  code: props.bin.code,
  zone: props.bin.zone
})

watch(
  () => props.isOpen,
  (open) => {
    if (open && props.bin) {
      form.value = {
        code: props.bin.code,
        zone: props.bin.zone
      }
    }
  }
)

const submitEdit = async () => {
  const formEl = document.getElementById("edit-bin-form") as HTMLFormElement
  if (formEl && !formEl.checkValidity()) {
    formEl.reportValidity()
    return
  }

  const payload: BinUpdate = {
    code: form.value.code ? form.value.code.trim().toUpperCase() : undefined,
    zone: form.value.zone !== undefined ? (form.value.zone?.trim() ? form.value.zone.trim() : null) : undefined
  }

  try {
    const updatedBin = await binService.updateBin(props.workspaceId, props.bin.id, payload)
    
    showToast("Bin updated successfully", "success")
    emit("updated", updatedBin)
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
