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

/**
 * Common directive lifecycle handlers
 */
export function createDirective(
  formatter: (el: HTMLElement, binding: DirectiveBinding) => void,
) {
  return {
    mounted: formatter,
    updated: formatter,
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
    return {
      mode: "options",
      value: undefined,
      options: { ...defaultOptions, ...value },
    };
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
  return el.textContent || el.getAttribute("data-value") || fallback;
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
): void {
  // Update element content
  el.textContent = formatted;

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
