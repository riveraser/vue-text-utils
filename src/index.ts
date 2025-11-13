import type { App } from "vue";
import CurrencyDirective from "./directives/currency";
import NumberDirective from "./directives/number";
import DateTimeDirective from "./directives/datetime";
import type { VueTextUtilsOptions } from "./types";
import { detectUserPreferences } from "./utils/auto-detect";

// Export individual directives for manual registration
export { CurrencyDirective, NumberDirective, DateTimeDirective };

// Export utilities
export {
  detectUserLocale,
  detectUserTimezone,
  detectUserCurrency,
  detectUserPreferences,
  hasBrowserSupport,
} from "./utils/auto-detect";

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
  autoDetect: true,
  debug: false,
};

// Function to get global options (used by directives)
export const getGlobalOptions = (): VueTextUtilsOptions => globalOptions;

// Main plugin that registers all directives
export const VueTextUtils = {
  install(app: App, options: VueTextUtilsOptions = {}) {
    // Auto-detect user preferences if enabled
    const autoDetectedPrefs =
      options.autoDetect !== false ? detectUserPreferences() : null;

    // Merge user options with auto-detected preferences and defaults
    globalOptions = {
      locale: options.locale || autoDetectedPrefs?.locale || "en-US",
      defaultCurrency:
        options.defaultCurrency || autoDetectedPrefs?.currency || "USD",
      defaultTimezone:
        options.defaultTimezone || autoDetectedPrefs?.timezone || "UTC",
      autoDetect: options.autoDetect ?? true,
      debug: options.debug ?? false,
    };

    if (globalOptions.debug) {
      console.log("VueTextUtils initialized with options:", globalOptions);
      if (autoDetectedPrefs) {
        console.log("Auto-detected user preferences:", autoDetectedPrefs);
      }
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
