<template>
  <BaseModal
    :is-open="isOpen"
    title="Add New Item"
    description="Add a new product to your workspace catalog"
    @close="$emit('close')"
  >
    <template #icon>
      <Package class="w-4 h-4" />
    </template>

    <form
      id="create-item-form"
      class="space-y-5"
      @submit.prevent="submitItem"
    >
      <!-- Title -->
      <div class="space-y-2">
        <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Item Title <span class="text-red-500">*</span>
        </label>
        <input
          v-model="form.title"
          required
          type="text"
          maxlength="255"
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
          placeholder="Wireless Noise-Cancelling Headphones"
        />
      </div>

      <!-- SKU & Price Row -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <!-- SKU -->
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            SKU / Part Number <span class="text-red-500">*</span>
          </label>
          <input
            v-model="form.sku"
            required
            type="text"
            maxlength="100"
            class="w-full rounded-xl border border-slate-200 dark:border-slate-700
                   bg-white dark:bg-slate-900
                   text-slate-900 dark:text-white
                   placeholder:text-slate-400 dark:placeholder:text-slate-500
                   px-4 py-3 text-sm font-mono uppercase
                   transition
                   focus:outline-none
                   focus:ring-2
                   focus:ring-brand-500/20
                   focus:border-brand-500"
            placeholder="ELEC-WHP-001"
          />
        </div>

        <!-- Base Price -->
        <div class="space-y-2">
          <label class="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Base Price
          </label>
          <div class="relative">
            <span class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500 font-bold text-sm select-none">
              {{ CURRENCY_SYMBOL }}
            </span>
            <!-- 
              Note: type="text" allows us full control over numeric-only 
              formatting without native browser conflicts. We append our target class here.
            -->
            <input
              v-model="displayPrice"
              @input="onPriceInput"
              type="text"
              inputmode="numeric"
              class="js-price-input w-full rounded-xl border border-slate-200 dark:border-slate-700
                     bg-white dark:bg-slate-900
                     text-slate-900 dark:text-white
                     placeholder:text-slate-400 dark:placeholder:text-slate-500
                     pl-8 pr-4 py-3 text-sm
                     transition
                     focus:outline-none
                     focus:ring-2
                     focus:ring-brand-500/20
                     focus:border-brand-500"
              placeholder="0.00"
            />
          </div>
        </div>
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
          form="create-item-form"
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
          {{ isSubmitting ? "Saving..." : "Save Item" }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue"
import { Package } from "lucide-vue-next"

import BaseModal from "@/components/ui/BaseModal.vue"
import { itemService } from "../services/item.service"
import type { ItemCreate } from "../types/item.types"
import { useToast } from "@/composables/useToast"
import { priceFormatter } from "@/utils/priceFormatter"

const props = defineProps<{
  isOpen: boolean
  workspaceId: string
}>()

const emit = defineEmits<{
  (e: "close"): void
  (e: "created", item: any): void
}>()

const { showToast } = useToast()

const isSubmitting = ref(false)

// Configured local currency constant
const CURRENCY_SYMBOL = "£"

// Tracks the typed-decimal formatted price shown in UI
const displayPrice = ref<string>("")

const form = ref<ItemCreate>({
  title: "",
  sku: "",
  base_price: null
})

// Reset on open/close
watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      form.value = {
        title: "",
        sku: "",
        base_price: null
      }
      displayPrice.value = ""
    }
  }
)

/**
 * Direct input listener to intercept changes on our classified price target
 */
const onPriceInput = (event: Event) => {
  const el = event.target as HTMLInputElement
  displayPrice.value = priceFormatter.formatElement(el, "js-price-input")
}

const submitItem = async () => {
  const trimmedTitle = form.value.title.trim()
  const trimmedSku = form.value.sku.trim().toUpperCase()

  if (!trimmedTitle) {
    showToast("Item Title is required", "error")
    return
  }

  if (!trimmedSku) {
    showToast("SKU is required", "error")
    return
  }

  // Safely translate UI decimal text into backend integer cents (or null)
  const basePriceInCents = priceFormatter.toCents(displayPrice.value)

  const payload: ItemCreate = {
    title: trimmedTitle,
    sku: trimmedSku,
    base_price: basePriceInCents
  }

  try {
    isSubmitting.value = true

    const newItem = await itemService.create(props.workspaceId, payload)
    
    showToast("Item created successfully", "success")
    emit("created", newItem)
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
  } finally {
    isSubmitting.value = false
  }
}
</script>
