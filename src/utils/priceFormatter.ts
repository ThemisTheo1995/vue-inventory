// src/utils/priceFormatter.ts

export const priceFormatter = {
  /**
   * Formats an input element's value on the fly using a cash-register digit-shifting flow.
   * It will only apply formatting if the element contains the target class property.
   */
  formatElement(input: HTMLInputElement, targetClass = 'js-price-input'): string {
    // If the input doesn't have our target class, leave it alone
    if (!input.classList.contains(targetClass)) {
      return input.value
    }

    // Strip out absolutely everything except numbers
    const digits = input.value.replace(/\D/g, '')
    
    if (!digits) return ''

    // Convert string of digits to integer cents, then to a 2-decimal representation
    const cents = parseInt(digits, 10)
    return (cents / 100).toFixed(2)
  },

  /**
   * Safely converts a formatted decimal string (e.g., "4.58") back to integer cents (e.g., 458)
   * for database storage, completely avoiding floating-point math issues.
   */
  toCents(val: string | number | null | undefined): number | null {
    if (val === null || val === undefined || val === '') return null
    
    const clean = String(val).replace(/[^0-9.]/g, '')
    const parsed = parseFloat(clean)
    
    return isNaN(parsed) ? null : Math.round(parsed * 100)
  }
}
