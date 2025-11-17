import type { Directive, DirectiveBinding } from "vue";
import { getGlobalOptions } from "../index";
import {
  createDirective,
  parseDirectiveBinding,
  extractElementValue,
  applyCommonAttributes,
  handleDirectiveError,
  validateDateValue,
  getDefaultLocale,
  type BaseFormatOptions,
} from "../utils/directive-helpers";

// Extend base options with datetime-specific options
interface DateTimeOptions extends BaseFormatOptions {
  dateStyle?: "full" | "long" | "medium" | "short" | "none";
  timeStyle?: "full" | "long" | "medium" | "short" | "none";
  timeZone?: string;
  inputFormat?: "auto";
}

/**
 * DateTime formatting directive
 */
const DateTimeDirective: Directive = createDirective(formatDateTime);

function formatDateTime(el: HTMLElement, binding: DirectiveBinding) {
  const globalOpts = getGlobalOptions();

  // Get default options
  const defaultLocale = getDefaultLocale(binding);
  const defaultTimezone = globalOpts.defaultTimezone || "UTC";

  const defaultOptions: DateTimeOptions = {
    dateStyle: "medium",
    timeStyle: "none",
    timeZone: defaultTimezone,
    accessibility: true,
    locale: defaultLocale,
    inputFormat: "auto",
  };

  // Parse the directive binding
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions,
  );

  // Get the date value based on mode
  let dateValue: Date | null;
  if (mode === "implicit" || mode === "options") {
    const elementText = extractElementValue(el, "");
    dateValue = validateDateValue(elementText, "DateTime");
  } else {
    dateValue = validateDateValue(value, "DateTime");
  }

  if (dateValue === null) {
    return;
  }

  try {
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
    const formatted = formatter.format(dateValue);

    // Apply common attributes and additional datetime-specific attributes
    applyCommonAttributes(el, options, formatted, "Date", {
      "data-date-value": dateValue.toISOString(),
      "data-timezone": options.timeZone || "UTC",
    });
  } catch (error) {
    handleDirectiveError("DateTime", error, value);
  }
}

export default DateTimeDirective;
