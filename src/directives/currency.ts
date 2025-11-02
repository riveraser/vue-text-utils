import type { Directive, DirectiveBinding } from "vue";
import type { CurrencyFormatOptions } from "../types";
import { getGlobalOptions } from "../index";

// Currency formatting directive
const CurrencyDirective: Directive = {
  mounted(el, binding) {
    formatCurrency(el, binding);
  },
  updated(el, binding) {
    formatCurrency(el, binding);
  },
};

function formatCurrency(el: HTMLElement, binding: DirectiveBinding) {
  const { value, arg } = binding;
  const globalOpts = getGlobalOptions();

  // Determine if value is options object or the actual value
  let numericValue: number;
  let options: CurrencyFormatOptions;

  // Get locale priority: i18n > global options > default
  const defaultLocale =
    (binding.instance as any)?.$i18n?.locale || globalOpts.locale || "en-US";
  const defaultCurrency = arg || globalOpts.defaultCurrency || "USD";

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    // Value is options object, get numeric value from element text or data attribute
    const elementText = el.textContent || el.getAttribute("data-value") || "0";
    numericValue = parseFloat(elementText);
    options = {
      currency: defaultCurrency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      accessibility: true,
      locale: defaultLocale,
      ...value,
    };
    // Override currency if arg is provided
    if (arg) {
      options.currency = arg;
    }
  } else {
    // Value is the numeric value
    numericValue = parseFloat(String(value));
    options = {
      currency: defaultCurrency,
      currencyDisplay: "symbol",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
      accessibility: true,
      locale: defaultLocale,
    };
  }

  // Parse the input value
  if (isNaN(numericValue)) {
    console.warn("Currency directive: Invalid numeric value:", value);
    return;
  }

  try {
    // Use Intl.NumberFormat for currency formatting
    const formatter = new Intl.NumberFormat(options.locale, {
      style: "currency",
      currency: options.currency,
      currencyDisplay: options.currencyDisplay,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits,
    });

    const formatted = formatter.format(numericValue);

    // Update element content
    el.textContent = formatted;

    // Add accessibility attributes if enabled
    if (options.accessibility) {
      el.setAttribute("aria-label", `Currency: ${formatted}`);
      el.setAttribute("data-currency-value", numericValue.toString());
      el.setAttribute("data-currency-code", options.currency);
    }

    // Add custom class if provided
    if (options.class) {
      el.classList.add(options.class);
    }
  } catch (error) {
    console.error("Currency directive formatting error:", error);
  }
}

export default CurrencyDirective;
