/***
 * SER:
 *
 * Helper functions and types for Vue.js formatting directives
 * This will do a DRY implementation of common logic used across
 * different formatting directives like number, currency, and datetime.
 */

import type { DirectiveBinding } from "vue";
import { getGlobalOptions } from "../index";

/**
 * Common directive binding modes
 */
export type DirectiveMode = "implicit" | "options" | "explicit";

/**
 * Base options that all formatting directives share
 */
export interface BaseFormatOptions {
  locale?: string;
  accessibility?: boolean;
  class?: string;
}

/**
 * Result of parsing directive binding
 */
export interface DirectiveParseResult<T extends BaseFormatOptions> {
  mode: DirectiveMode;
  value: unknown;
  options: T;
}

// Store for captured textContent (used for implicit mode reactivity)
const capturedTextContent = new WeakMap<HTMLElement, string>();
const mutationObservers = new WeakMap<HTMLElement, MutationObserver>();

/**
 * Common directive lifecycle handlers
 */
export function createDirective(
  formatter: (el: HTMLElement, binding: DirectiveBinding) => void,
) {
  const pendingTasks = new WeakMap<HTMLElement, boolean>();
  const latestBindings = new WeakMap<HTMLElement, DirectiveBinding>();

  const scheduleFormat = (el: HTMLElement, binding: DirectiveBinding) => {
    // Capture the current textContent synchronously before any async operations
    // This is crucial for implicit mode where Vue updates the textContent
    const currentText = el.textContent || "";
    capturedTextContent.set(el, currentText);

    latestBindings.set(el, binding);

    if (pendingTasks.get(el)) {
      return;
    }

    pendingTasks.set(el, true);
    queueMicrotask(() => {
      pendingTasks.delete(el);
      const currentBinding = latestBindings.get(el) || binding;
      formatter(el, currentBinding);
    });
  };

  const mountDirective = (el: HTMLElement, binding: DirectiveBinding) => {
    // Warn about implicit mode with reactive data
    if (binding.value === undefined || binding.value === null) {
      const globalOpts = getGlobalOptions();
      if (globalOpts.debug) {
        console.warn(
          "[VueTextUtils] Implicit mode detected. Note: Implicit mode with {{ }} interpolation does NOT support reactivity. " +
            'For reactive data, use explicit mode instead: v-currency="yourValue" instead of v-currency>{{ yourValue }}',
        );
      }
    }
    scheduleFormat(el, binding);
  };

  const unmountDirective = (el: HTMLElement) => {
    // Clean up the observer when the directive is unmounted
    const observer = mutationObservers.get(el);
    if (observer) {
      observer.disconnect();
      mutationObservers.delete(el);
    }
  };

  return {
    mounted: mountDirective,
    updated: scheduleFormat,
    unmounted: unmountDirective,
  };
}

/**
 * Get the default locale with proper priority
 */
export function getDefaultLocale(binding: DirectiveBinding): string {
  const globalOpts = getGlobalOptions();
  const instance = binding.instance as { $i18n?: { locale?: string } } | null;
  return instance?.$i18n?.locale || globalOpts.locale || "en-US";
}

/**
 * Determine directive mode and extract value/options
 */
export function parseDirectiveBinding<T extends BaseFormatOptions>(
  binding: DirectiveBinding,
  defaultOptions: T,
): DirectiveParseResult<T> {
  const { value } = binding;

  if (value === undefined || value === null) {
    return {
      mode: "implicit",
      value: undefined,
      options: { ...defaultOptions },
    };
  }

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    !(value instanceof Date)
  ) {
    // Check if the object has a 'value' property for explicit mode with options
    const hasValueProp = "value" in value && value.value !== undefined;

    if (hasValueProp) {
      // Explicit mode with options: { value: 123, currency: 'EUR' }
      // This supports reactivity because the value is passed as binding.value.value
      const { value: extractedValue, ...restOptions } = value;
      return {
        mode: "explicit",
        value: extractedValue,
        options: { ...defaultOptions, ...restOptions },
      };
    } else {
      // Implicit mode with options: v-currency="{ currency: 'EUR' }">{{ value }}
      // Note: This does NOT support reactivity with {{ }} interpolation
      return {
        mode: "options",
        value: undefined,
        options: { ...defaultOptions, ...value },
      };
    }
  }

  return {
    mode: "explicit",
    value: value,
    options: { ...defaultOptions },
  };
}

/**
 * Extract value from element or data attribute
 */
export function extractElementValue(
  el: HTMLElement,
  fallback: string = "",
): string {
  // Try to get the captured textContent from Vue's render (before any async operations)
  const captured = capturedTextContent.get(el);
  const textContent = captured !== undefined ? captured : el.textContent || "";
  const storedRawValue = el.getAttribute("data-raw-value");

  // Check if we have a stored raw value from previous formatting
  if (storedRawValue !== null) {
    // If the text content is the same as the stored raw value, return it
    if (textContent.trim() === storedRawValue.trim()) {
      return storedRawValue;
    }

    // Text content has changed - determine if it's a Vue update or our own formatting
    // Check if the text content appears to be a plain number (potential raw value from Vue)
    const textAsNumber = textContent.replace(/^\s+|\s+$/g, "");
    const isLikelyRawNumber = /^-?\d+(\.\d+)?$/.test(textAsNumber);

    // Check if the stored raw value is a plain number
    const storedAsNumber = storedRawValue.replace(/^\s+|\s+$/g, "");
    const storedIsRawNumber = /^-?\d+(\.\d+)?$/.test(storedAsNumber);

    // If both look like raw numbers and they're different, Vue has updated the value
    if (
      isLikelyRawNumber &&
      storedIsRawNumber &&
      textAsNumber !== storedAsNumber
    ) {
      el.setAttribute("data-raw-value", textContent.trim());
      return textContent.trim();
    }

    // If the current text looks like a raw number but stored value doesn't,
    // Vue has updated with a new raw value
    if (isLikelyRawNumber && !storedIsRawNumber) {
      el.setAttribute("data-raw-value", textContent.trim());
      return textContent.trim();
    }

    // Default case: assume the directive hasn't run yet and use stored raw value
    return storedRawValue;
  }

  // If no stored value, use text content and store it for future updates
  const trimmedContent = textContent.trim();
  if (trimmedContent) {
    el.setAttribute("data-raw-value", trimmedContent);
  }

  // Fall back to data-value attribute or the provided fallback
  return trimmedContent || el.getAttribute("data-value") || fallback;
}

/**
 * Apply common accessibility attributes and classes
 */
export function applyCommonAttributes(
  el: HTMLElement,
  options: BaseFormatOptions,
  formatted: string,
  ariaPrefix: string,
  additionalAttrs: Record<string, string> = {},
  rawValue?: string | number,
): void {
  // Update element content
  el.textContent = formatted;

  // Store the original raw value for future updates
  if (rawValue !== undefined) {
    el.setAttribute("data-raw-value", String(rawValue));
  }

  // Add accessibility attributes if enabled
  if (options.accessibility) {
    el.setAttribute("aria-label", `${ariaPrefix}: ${formatted}`);

    // Apply additional attributes
    Object.entries(additionalAttrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }

  // Add custom class if provided
  if (options.class) {
    el.classList.add(options.class);
  }
}

/**
 * Handle directive errors consistently
 */
export function handleDirectiveError(
  directiveName: string,
  error: unknown,
  value?: unknown,
): void {
  if (error instanceof Error) {
    console.error(`${directiveName} directive formatting error:`, error);
  } else {
    console.warn(`${directiveName} directive: Invalid value:`, value);
  }
}

/**
 * Validate numeric input
 */
export function validateNumericValue(
  value: unknown,
  directiveName: string,
): number | null {
  const numericValue = parseFloat(String(value));
  if (isNaN(numericValue)) {
    console.warn(`${directiveName} directive: Invalid numeric value:`, value);
    return null;
  }
  return numericValue;
}

/**
 * Validate date input
 */
export function validateDateValue(
  value: unknown,
  directiveName: string,
): Date | null {
  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string" || typeof value === "number") {
    const parsed = new Date(value);
    if (isNaN(parsed.getTime())) {
      console.warn(`${directiveName} directive: Invalid date value:`, value);
      return null;
    }
    return parsed;
  }

  console.warn(`${directiveName} directive: Invalid date value:`, value);
  return null;
}
