import type { Directive } from 'vue'
import type { NumberFormatOptions } from '../types'

/**
 * Number formatting directive
 */
const NumberDirective: Directive = {
  mounted(el, binding) {
    formatNumber(el, binding)
  },
  updated(el, binding) {
    formatNumber(el, binding)
  }
}

function formatNumber(el: HTMLElement, binding: any) {
  const { value, modifiers, arg } = binding
  
  // Get options from binding
  const options: NumberFormatOptions = {
    minimumFractionDigits: undefined,
    maximumFractionDigits: undefined,
    useGrouping: true,
    percentage: false,
    accessibility: true,
    locale: binding.instance?.$i18n?.locale || 'en-US',
    ...binding.value
  }
  
  // Parse the input value
  const numericValue = parseFloat(value)
  if (isNaN(numericValue)) {
    console.warn('Number directive: Invalid numeric value:', value)
    return
  }
  
  try {
    // Use Intl.NumberFormat for number formatting
    const formatterOptions: Intl.NumberFormatOptions = {
      useGrouping: options.useGrouping,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits
    }
    
    const formatter = new Intl.NumberFormat(options.locale, formatterOptions)
    
    let formatted: string
    if (options.percentage) {
      // For percentage, multiply by 100 and add % symbol
      formatted = formatter.format(numericValue * 100) + '%'
    } else {
      formatted = formatter.format(numericValue)
    }
    
    // Update element content
    el.textContent = formatted
    
    // Add accessibility attributes if enabled
    if (options.accessibility) {
      el.setAttribute('aria-label', `Number: ${formatted}`)
      el.setAttribute('data-number-value', numericValue.toString())
    }
    
    // Add custom class if provided
    if (options.class) {
      el.classList.add(options.class)
    }
    
  } catch (error) {
    console.error('Number directive formatting error:', error)
  }
}

export default NumberDirective