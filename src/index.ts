import type { App } from "vue";
import CurrencyDirective from "./directives/currency";
import NumberDirective from "./directives/number";
import DateTimeDirective from "./directives/datetime";
import type { VueTextUtilsOptions } from "./types";

// Export individual directives for manual registration
export { CurrencyDirective, NumberDirective, DateTimeDirective };

// Export types
export type {
  VueTextUtilsOptions,
  CurrencyFormatOptions,
  NumberFormatOptions,
  DateTimeFormatOptions,
} from "./types";

// Export all directives for easy registration
export const formatDirectives = {
  currency: CurrencyDirective,
  number: NumberDirective,
  "date-time": DateTimeDirective,
};

// Global options storage
let globalOptions: VueTextUtilsOptions = {
  locale: "en-US",
  defaultCurrency: "USD",
  defaultTimezone: "UTC",
  debug: false,
};

// Function to get global options (used by directives)
export const getGlobalOptions = (): VueTextUtilsOptions => globalOptions;

// Main plugin that registers all directives
export const VueTextUtils = {
  install(app: App, options: VueTextUtilsOptions = {}) {
    // Merge user options with defaults
    globalOptions = {
      locale: "en-US",
      defaultCurrency: "USD",
      defaultTimezone: "UTC",
      debug: false,
      ...options,
    };

    if (globalOptions.debug) {
      console.log("VueTextUtils initialized with options:", globalOptions);
    }

    // Make global options available to the app
    app.provide("vueTextUtilsOptions", globalOptions);

    // Register all format directives
    Object.entries(formatDirectives).forEach(([name, directive]) => {
      app.directive(name, directive);
      app.directive(`format.${name}`, directive);
    });
  },
};
