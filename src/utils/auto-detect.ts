/**
 * Browser auto-detection utilities for locale, timezone, and currency
 */

/**
 * Detects user's locale from browser
 * Uses multiple fallback methods for maximum compatibility
 */
export function detectUserLocale(): string {
  try {
    // Try navigator.language first (most accurate)
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language;
    }

    // Fallback to Intl API detected locale
    if (typeof Intl !== "undefined") {
      const detectedLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
      if (detectedLocale) {
        return detectedLocale;
      }
    }

    // Final fallback
    return "en-US";
  } catch (error) {
    console.warn("Could not detect user locale:", error);
    return "en-US";
  }
}

/**
 * Detects user's timezone from browser
 */
export function detectUserTimezone(): string {
  try {
    if (typeof Intl !== "undefined") {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }

    // Fallback to UTC if detection fails
    return "UTC";
  } catch (error) {
    console.warn("Could not detect user timezone:", error);
    return "UTC";
  }
}

/**
 * Infers user's preferred currency from locale
 * Uses Intl.NumberFormat to detect currency for locale
 */
export function detectUserCurrency(locale?: string): string {
  try {
    const userLocale = locale || detectUserLocale();

    // Try to get currency from NumberFormat for the locale
    if (typeof Intl !== "undefined") {
      // Create a number formatter with currency style for the locale
      // This will use the default currency for that locale
      const formatter = new Intl.NumberFormat(userLocale, {
        style: "currency",
        currency: getCurrencyForLocale(userLocale),
      });

      const options = formatter.resolvedOptions();
      if (options.currency) {
        return options.currency;
      }
    }

    return "USD"; // Fallback
  } catch (error) {
    console.warn("Could not detect user currency:", error);
    return "USD";
  }
}

/**
 * Maps common locales to their typical currencies
 * This is a fallback when Intl API doesn't provide currency info
 * SR:
 * WARNING: This is not exhaustive and may not cover all cases
 * so you must add the currency manually if needed.
 */
function getCurrencyForLocale(locale: string): string {
  const currencyMap: Record<string, string> = {
    // Major currencies
    "en-US": "USD",
    "en-GB": "GBP",
    "en-CA": "CAD",
    "en-AU": "AUD",
    "en-NZ": "NZD",

    // European Union
    "de-DE": "EUR",
    "fr-FR": "EUR",
    "es-ES": "EUR",
    "it-IT": "EUR",
    "nl-NL": "EUR",
    "pt-PT": "EUR",
    "el-GR": "EUR",
    "fi-FI": "EUR",
    "at-AT": "EUR",
    "be-BE": "EUR",
    "ie-IE": "EUR",
    "lu-LU": "EUR",
    "mt-MT": "EUR",
    "sk-SK": "EUR",
    "si-SI": "EUR",
    "ee-EE": "EUR",
    "lv-LV": "EUR",
    "lt-LT": "EUR",

    // Asia Pacific
    "ja-JP": "JPY",
    "ko-KR": "KRW",
    "zh-CN": "CNY",
    "zh-TW": "TWD",
    "zh-HK": "HKD",
    "th-TH": "THB",
    "vi-VN": "VND",
    "id-ID": "IDR",
    "my-MY": "MYR",
    "sg-SG": "SGD",
    "ph-PH": "PHP",
    "in-IN": "INR",

    // Americas
    "es-MX": "MXN",
    "pt-BR": "BRL",
    "es-AR": "ARS",
    "es-CL": "CLP",
    "es-CO": "COP",
    "es-PE": "PEN",
    "es-US": "USD", // Spanish speakers in US
    "ca-CA": "CAD",
    "en-JM": "JMD",
    "en-BB": "BBD",
    "en-TT": "TTD",

    // Others
    "ru-RU": "RUB",
    "pl-PL": "PLN",
    "tr-TR": "TRY",
    "he-IL": "ILS",
    "ar-SA": "SAR",
    "ar-AE": "AED",
    "no-NO": "NOK",
    "sv-SE": "SEK",
    "da-DK": "DKK",
    "cs-CZ": "CZK",
    "hu-HU": "HUF",
    "ro-RO": "RON",
    "bg-BG": "BGN",
    "hr-HR": "HRK",
    "uk-UA": "UAH",
  };

  // Try exact match first
  if (currencyMap[locale]) {
    return currencyMap[locale];
  }

  // Try language code only (e.g., "en" from "en-US")
  const languageCode = locale.split("-")[0];
  const matchingLocale = Object.keys(currencyMap).find(key =>
    key.startsWith(languageCode + "-"),
  );

  if (matchingLocale) {
    return currencyMap[matchingLocale];
  }

  // Default fallback
  return "USD";
}

/**
 * Detects all user preferences at once
 * Returns an object with locale, timezone, and currency
 */
export function detectUserPreferences(): {
  locale: string;
  timezone: string;
  currency: string;
} {
  const locale = detectUserLocale();
  const timezone = detectUserTimezone();
  const currency = detectUserCurrency(locale);

  return {
    locale,
    timezone,
    currency,
  };
}

/**
 * Checks if the browser supports the required Intl APIs
 */
export function hasBrowserSupport(): {
  intl: boolean;
  dateTimeFormat: boolean;
  numberFormat: boolean;
  navigator: boolean;
} {
  return {
    intl: typeof Intl !== "undefined",
    dateTimeFormat:
      typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function",
    numberFormat:
      typeof Intl !== "undefined" && typeof Intl.NumberFormat === "function",
    navigator:
      typeof navigator !== "undefined" &&
      typeof navigator.language === "string",
  };
}
