import type { Directive, DirectiveBinding } from "vue";
import type { DateTimeFormatOptions } from "../types";

/**
 * DateTime formatting directive
 */
const DateTimeDirective: Directive = {
  mounted(el, binding) {
    formatDateTime(el, binding);
  },
  updated(el, binding) {
    formatDateTime(el, binding);
  },
};

function formatDateTime(el: HTMLElement, binding: DirectiveBinding) {
  const { value } = binding;

  // Determine if value is options object or the actual date value
  let inputValue: any;
  let options: DateTimeFormatOptions;

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    // Value is options object, get date value from element text or data attribute
    const elementText = el.textContent || el.getAttribute("data-value") || "";
    inputValue = elementText;
    options = {
      dateStyle: "medium",
      timeStyle: "none",
      timeZone: "UTC",
      accessibility: true,
      locale: (binding.instance as any)?.$i18n?.locale || "en-US",
      inputFormat: "auto",
      ...value,
    };
  } else {
    // Value is the date value
    inputValue = value;
    options = {
      dateStyle: "medium",
      timeStyle: "none",
      timeZone: "UTC",
      accessibility: true,
      locale: (binding.instance as any)?.$i18n?.locale || "en-US",
      inputFormat: "auto",
    };
  }

  try {
    // Parse the input date
    let date: Date;

    if (inputValue instanceof Date) {
      date = inputValue;
    } else if (
      typeof inputValue === "string" ||
      typeof inputValue === "number"
    ) {
      // Try to parse the string/number as a date
      const parsed = new Date(inputValue);
      if (isNaN(parsed.getTime())) {
        console.warn("DateTime directive: Invalid date value:", inputValue);
        return;
      }
      date = parsed;
    } else {
      console.warn("DateTime directive: Invalid date value:", inputValue);
      return;
    }

    // Format using Intl.DateTimeFormat
    const formatterOptions: Intl.DateTimeFormatOptions = {};

    if (options.dateStyle && options.dateStyle !== "none") {
      formatterOptions.dateStyle = options.dateStyle;
    }

    if (options.timeStyle && options.timeStyle !== "none") {
      formatterOptions.timeStyle = options.timeStyle;
    }

    if (options.timeZone) {
      formatterOptions.timeZone = options.timeZone;
    }

    const formatter = new Intl.DateTimeFormat(options.locale, formatterOptions);
    const formatted = formatter.format(date);

    // Update element content
    el.textContent = formatted;

    // Add accessibility attributes if enabled
    if (options.accessibility) {
      el.setAttribute("aria-label", `Date: ${formatted}`);
      el.setAttribute("data-date-value", date.toISOString());
      el.setAttribute("data-timezone", options.timeZone || "UTC");
    }

    // Add custom class if provided
    if (options.class) {
      el.classList.add(options.class);
    }
  } catch (error) {
    console.error("DateTime directive formatting error:", error);
  }
}

export default DateTimeDirective;
