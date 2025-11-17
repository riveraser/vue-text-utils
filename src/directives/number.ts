import type { Directive, DirectiveBinding } from "vue";
import {
  createDirective,
  parseDirectiveBinding,
  extractElementValue,
  applyCommonAttributes,
  handleDirectiveError,
  validateNumericValue,
  getDefaultLocale,
  type BaseFormatOptions,
} from "../utils/directive-helpers";

// Extend base options with number-specific options
interface NumberOptions extends BaseFormatOptions {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  useGrouping?: boolean;
  percentage?: boolean;
}

/**
 * Number formatting directive
 */
const NumberDirective: Directive = createDirective(formatNumber);

function formatNumber(el: HTMLElement, binding: DirectiveBinding) {
  // Get default options
  const defaultLocale = getDefaultLocale(binding);

  const defaultOptions: NumberOptions = {
    minimumFractionDigits: undefined,
    maximumFractionDigits: undefined,
    useGrouping: true,
    percentage: false,
    accessibility: true,
    locale: defaultLocale,
  };

  // Parse the directive binding
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions,
  );

  // Get the numeric value based on mode
  let numericValue: number | null;
  let rawValue: string | number;

  if (mode === "implicit" || mode === "options") {
    rawValue = extractElementValue(el, "0");
    numericValue = validateNumericValue(rawValue, "Number");
  } else {
    rawValue = value as string | number;
    numericValue = validateNumericValue(rawValue, "Number");
  }

  if (numericValue === null) {
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

    // Apply common attributes and additional number-specific attributes
    applyCommonAttributes(
      el,
      options,
      formatted,
      "Number",
      {
        "data-number-value": numericValue.toString(),
      },
      rawValue,
    );
  } catch (error) {
    handleDirectiveError("Number", error, value);
  }
}

export default NumberDirective;
