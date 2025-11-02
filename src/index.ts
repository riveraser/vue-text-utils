import type { App } from 'vue'
import CurrencyDirective from './directives/currency'
import NumberDirective from './directives/number'
import DateTimeDirective from './directives/datetime'

// Export individual directives for manual registration
export { CurrencyDirective, NumberDirective, DateTimeDirective }

// Export all directives for easy registration
export const formatDirectives = {
  currency: CurrencyDirective,
  number: NumberDirective,
  'date-time': DateTimeDirective
}

// Default export - plugin that registers all directives
const VueTextUtils = {
  install(app: App) {
    // Register all format directives
    Object.entries(formatDirectives).forEach(([name, directive]) => {
      app.directive(name, directive)
      app.directive(`format.${name}`, directive)
    })
  }
}

// Export as both named and default export
export { VueTextUtils as default }