/**
 * Global options for the Vue Text Utils plugin
 */
export interface VueTextUtilsOptions {
  /**
   * Default locale to use for formatting
   * @default auto-detected from browser or 'en-US'
   */
  locale?: string;

  /**
   * Default currency code for currency formatting
   * @default auto-detected from locale or 'USD'
   */
  defaultCurrency?: string;

  /**
   * Default timezone for date formatting
   * @default auto-detected from browser or 'UTC'
   */
  defaultTimezone?: string;

  /**
   * Enable automatic detection of user preferences from browser
   * @default true
   */
  autoDetect?: boolean;

  /**
   * Enable debugging mode for development
   * @default false
   */
  debug?: boolean;
}

/**
 * Base options for all format directives
 */
export interface BaseFormatOptions {
  /**
   * Override locale for this specific formatting
   */
  locale?: string;

  /**
   * Enable accessibility features (semantic HTML, ARIA labels)
   * @default true
   */
  accessibility?: boolean;

  /**
   * Custom CSS class to add to formatted element
   */
  class?: string;
}

/**
 * Options for currency formatting directive
 */
export interface CurrencyFormatOptions extends BaseFormatOptions {
  /**
   * Currency code (USD, EUR, GBP, etc.)
   */
  currency: string;

  /**
   * Currency display format
   * @default 'symbol'
   */
  currencyDisplay?: "symbol" | "code" | "name" | "narrowSymbol";

  /**
   * Number of decimal places
   * @default 2
   */
  minimumFractionDigits?: number;

  /**
   * Maximum number of decimal places
   * @default 2
   */
  maximumFractionDigits?: number;
}

/**
 * Options for number formatting directive
 */
export interface NumberFormatOptions extends BaseFormatOptions {
  /**
   * Number of decimal places
   */
  minimumFractionDigits?: number;

  /**
   * Maximum number of decimal places
   */
  maximumFractionDigits?: number;

  /**
   * Use grouping for thousands separator
   * @default true
   */
  useGrouping?: boolean;

  /**
   * Format as percentage
   * @default false
   */
  percentage?: boolean;
}

/**
 * Options for date-time formatting directive
 */
export interface DateTimeFormatOptions extends BaseFormatOptions {
  /**
   * Date/time style
   */
  dateStyle?: "full" | "long" | "medium" | "short" | "none";

  /**
   * Time style
   */
  timeStyle?: "full" | "long" | "medium" | "short" | "none";

  /**
   * Timezone to use
   */
  timeZone?: string;

  /**
   * Custom format string (using Intl formatToParts tokens)
   */
  format?: string;

  /**
   * Input date format hint for parsing
   */
  inputFormat?: string;
}

/**
 * Combined format options type
 */
export type FormatDirectiveOptions =
  | CurrencyFormatOptions
  | NumberFormatOptions
  | DateTimeFormatOptions;
