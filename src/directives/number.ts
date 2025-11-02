import type { Directive, DirectiveBinding } from "vue";
import type { NumberFormatOptions } from "../types";
import { getGlobalOptions } from "../index";

/**
 * Number formatting directive
 */
const NumberDirective: Directive = {
  mounted(el, binding) {
    formatNumber(el, binding);
  },
  updated(el, binding) {
    formatNumber(el, binding);
  },
};

function formatNumber(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;
  const globalOpts = getGlobalOptions();

  // Determine if value is options object or the actual value
  let numericValue: number;
  let options: NumberFormatOptions;

  // Get locale priority: i18n > global options > default
  const defaultLocale =
    (binding.instance as any)?.$i18n?.locale || globalOpts.locale || "en-US";

  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    // Value is options object, get numeric value from element text or data attribute
    const elementText = el.textContent || el.getAttribute("data-value") || "0";
    numericValue = parseFloat(elementText);
    options = {
      minimumFractionDigits: undefined,
      maximumFractionDigits: undefined,
      useGrouping: true,
      percentage: false,
      accessibility: true,
      locale: defaultLocale,
      ...value,
    };
  } else {
    // Value is the numeric value
    numericValue = parseFloat(String(value));
    options = {
      minimumFractionDigits: undefined,
      maximumFractionDigits: undefined,
      useGrouping: true,
      percentage: false,
      accessibility: true,
      locale: defaultLocale,
    };
  }

  // Parse the input value
  if (isNaN(numericValue)) {
    console.warn("Number directive: Invalid numeric value:", value);
    return;
  }

  try {
    // Use Intl.NumberFormat for number formatting
    const formatterOptions: Intl.NumberFormatOptions = {
      useGrouping: options.useGrouping,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits,
    };

    const formatter = new Intl.NumberFormat(options.locale, formatterOptions);

    let formatted: string;
    if (options.percentage) {
      // For percentage, multiply by 100 and add % symbol
      formatted = formatter.format(numericValue * 100) + "%";
    } else {
      formatted = formatter.format(numericValue);
    }

    // Update element content
    el.textContent = formatted;

    // Add accessibility attributes if enabled
    if (options.accessibility) {
      el.setAttribute("aria-label", `Number: ${formatted}`);
      el.setAttribute("data-number-value", numericValue.toString());
    }

    // Add custom class if provided
    if (options.class) {
      el.classList.add(options.class);
    }
  } catch (error) {
    console.error("Number directive formatting error:", error);
  }
}

export default NumberDirective;
