import type { Directive, DirectiveBinding } from "vue";
import { getGlobalOptions } from "../index";
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

// Extend base options with currency-specific options
interface CurrencyOptions extends BaseFormatOptions {
  currency?: string;
  currencyDisplay?: "symbol" | "code" | "name";
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

// Currency formatting directive
const CurrencyDirective: Directive = createDirective(formatCurrency);

function formatCurrency(el: HTMLElement, binding: DirectiveBinding) {
  const { arg } = binding;
  const globalOpts = getGlobalOptions();

  // Get default options
  const defaultLocale = getDefaultLocale(binding);
  const defaultCurrency = arg || globalOpts.defaultCurrency || "USD";

  const defaultOptions: CurrencyOptions = {
    currency: defaultCurrency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    accessibility: true,
    locale: defaultLocale,
  };

  // Parse the directive binding
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions,
  );

  // Override currency if arg is provided (for options mode)
  if (mode === "options" && arg) {
    options.currency = arg;
  }

  // Get the numeric value based on mode
  let numericValue: number | null;
  if (mode === "implicit" || mode === "options") {
    const elementText = extractElementValue(el, "0");
    numericValue = validateNumericValue(elementText, "Currency");
  } else {
    numericValue = validateNumericValue(value, "Currency");
  }

  if (numericValue === null) {
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

    // Apply common attributes and additional currency-specific attributes
    applyCommonAttributes(el, options, formatted, "Currency", {
      "data-currency-value": numericValue.toString(),
      "data-currency-code": options.currency || "USD",
    });
  } catch (error) {
    handleDirectiveError("Currency", error, value);
  }
}

export default CurrencyDirective;
