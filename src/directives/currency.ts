import type { Directive } from 'vue'
import type { CurrencyFormatOptions } from '../types'

/**
 * Currency formatting directive
 */
const CurrencyDirective: Directive = {
  mounted(el, binding) {
    formatCurrency(el, binding)
  },
  updated(el, binding) {
    formatCurrency(el, binding)
  }
}

function formatCurrency(el: HTMLElement, binding: any) {
  const { value, modifiers, arg } = binding
  
  // Get options from binding
  const options: CurrencyFormatOptions = {
    currency: arg || 'USD',
    currencyDisplay: 'symbol',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    accessibility: true,
    locale: binding.instance?.$i18n?.locale || 'en-US',
    ...binding.value
  }
  
  // Parse the input value
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) {
    console.warn('Currency directive: Invalid numeric value:', value)
    return
  }
  
  try {
    // Use Intl.NumberFormat for currency formatting
    const formatter = new Intl.NumberFormat(options.locale, {
      style: 'currency',
      currency: options.currency,
      currencyDisplay: options.currencyDisplay,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits
    })
    
    const formatted = formatter.format(numericValue)
    
    // Update element content
    el.textContent = formatted
    
    // Add accessibility attributes if enabled
    if (options.accessibility) {
      el.setAttribute('aria-label', `Currency: ${formatted}`)
      el.setAttribute('data-currency-value', numericValue.toString())
      el.setAttribute('data-currency-code', options.currency)
    }
    
    // Add custom class if provided
    if (options.class) {
      el.classList.add(options.class)
    }
    
  } catch (error) {
    console.error('Currency directive formatting error:', error)
  }
}

export default CurrencyDirective