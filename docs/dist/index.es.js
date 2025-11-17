var __defProp = Object.defineProperty;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
const capturedTextContent = /* @__PURE__ */ new WeakMap();
const mutationObservers = /* @__PURE__ */ new WeakMap();
function createDirective(formatter) {
  const pendingTasks = /* @__PURE__ */ new WeakMap();
  const latestBindings = /* @__PURE__ */ new WeakMap();
  const scheduleFormat = (el, binding) => {
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
  const mountDirective = (el, binding) => {
    if (binding.value === void 0 || binding.value === null) {
      const globalOpts = getGlobalOptions();
      if (globalOpts.debug) {
        console.warn(
          '[VueTextUtils] Implicit mode detected. Note: Implicit mode with {{ }} interpolation does NOT support reactivity. For reactive data, use explicit mode instead: v-currency="yourValue" instead of v-currency>{{ yourValue }}'
        );
      }
    }
    scheduleFormat(el, binding);
  };
  const unmountDirective = (el) => {
    const observer = mutationObservers.get(el);
    if (observer) {
      observer.disconnect();
      mutationObservers.delete(el);
    }
  };
  return {
    mounted: mountDirective,
    updated: scheduleFormat,
    unmounted: unmountDirective
  };
}
function getDefaultLocale(binding) {
  var _a;
  const globalOpts = getGlobalOptions();
  const instance = binding.instance;
  return ((_a = instance == null ? void 0 : instance.$i18n) == null ? void 0 : _a.locale) || globalOpts.locale || "en-US";
}
function parseDirectiveBinding(binding, defaultOptions) {
  const { value } = binding;
  if (value === void 0 || value === null) {
    return {
      mode: "implicit",
      value: void 0,
      options: __spreadValues({}, defaultOptions)
    };
  }
  if (typeof value === "object" && value !== null && !Array.isArray(value) && !(value instanceof Date)) {
    const hasValueProp = "value" in value && value.value !== void 0;
    if (hasValueProp) {
      const _a = value, { value: extractedValue } = _a, restOptions = __objRest(_a, ["value"]);
      return {
        mode: "explicit",
        value: extractedValue,
        options: __spreadValues(__spreadValues({}, defaultOptions), restOptions)
      };
    } else {
      return {
        mode: "options",
        value: void 0,
        options: __spreadValues(__spreadValues({}, defaultOptions), value)
      };
    }
  }
  return {
    mode: "explicit",
    value,
    options: __spreadValues({}, defaultOptions)
  };
}
function extractElementValue(el, fallback = "") {
  const captured = capturedTextContent.get(el);
  const textContent = captured !== void 0 ? captured : el.textContent || "";
  const storedRawValue = el.getAttribute("data-raw-value");
  if (storedRawValue !== null) {
    if (textContent.trim() === storedRawValue.trim()) {
      return storedRawValue;
    }
    const textAsNumber = textContent.replace(/^\s+|\s+$/g, "");
    const isLikelyRawNumber = /^-?\d+(\.\d+)?$/.test(textAsNumber);
    const storedAsNumber = storedRawValue.replace(/^\s+|\s+$/g, "");
    const storedIsRawNumber = /^-?\d+(\.\d+)?$/.test(storedAsNumber);
    if (isLikelyRawNumber && storedIsRawNumber && textAsNumber !== storedAsNumber) {
      el.setAttribute("data-raw-value", textContent.trim());
      return textContent.trim();
    }
    if (isLikelyRawNumber && !storedIsRawNumber) {
      el.setAttribute("data-raw-value", textContent.trim());
      return textContent.trim();
    }
    return storedRawValue;
  }
  const trimmedContent = textContent.trim();
  if (trimmedContent) {
    el.setAttribute("data-raw-value", trimmedContent);
  }
  return trimmedContent || el.getAttribute("data-value") || fallback;
}
function applyCommonAttributes(el, options, formatted, ariaPrefix, additionalAttrs = {}, rawValue) {
  el.textContent = formatted;
  if (rawValue !== void 0) {
    el.setAttribute("data-raw-value", String(rawValue));
  }
  if (options.accessibility) {
    el.setAttribute("aria-label", `${ariaPrefix}: ${formatted}`);
    Object.entries(additionalAttrs).forEach(([key, value]) => {
      el.setAttribute(key, value);
    });
  }
  if (options.class) {
    el.classList.add(options.class);
  }
}
function handleDirectiveError(directiveName, error, value) {
  if (error instanceof Error) {
    console.error(`${directiveName} directive formatting error:`, error);
  } else {
    console.warn(`${directiveName} directive: Invalid value:`, value);
  }
}
function validateNumericValue(value, directiveName) {
  const numericValue = parseFloat(String(value));
  if (isNaN(numericValue)) {
    console.warn(`${directiveName} directive: Invalid numeric value:`, value);
    return null;
  }
  return numericValue;
}
function validateDateValue(value, directiveName) {
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
const CurrencyDirective = createDirective(formatCurrency);
function formatCurrency(el, binding) {
  const { arg } = binding;
  const globalOpts = getGlobalOptions();
  const defaultLocale = getDefaultLocale(binding);
  const defaultCurrency = arg || globalOpts.defaultCurrency || "USD";
  const defaultOptions = {
    currency: defaultCurrency,
    currencyDisplay: "symbol",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    accessibility: true,
    locale: defaultLocale
  };
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions
  );
  if (mode === "options" && arg) {
    options.currency = arg;
  }
  let numericValue;
  let rawValue;
  if (mode === "implicit" || mode === "options") {
    rawValue = extractElementValue(el, "0");
    numericValue = validateNumericValue(rawValue, "Currency");
  } else {
    rawValue = value;
    numericValue = validateNumericValue(rawValue, "Currency");
  }
  if (numericValue === null) {
    return;
  }
  try {
    const formatter = new Intl.NumberFormat(options.locale, {
      style: "currency",
      currency: options.currency,
      currencyDisplay: options.currencyDisplay,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits
    });
    const formatted = formatter.format(numericValue);
    applyCommonAttributes(
      el,
      options,
      formatted,
      "Currency",
      {
        "data-currency-value": numericValue.toString(),
        "data-currency-code": options.currency || "USD"
      },
      rawValue
    );
  } catch (error) {
    handleDirectiveError("Currency", error, value);
  }
}
const NumberDirective = createDirective(formatNumber);
function formatNumber(el, binding) {
  const defaultLocale = getDefaultLocale(binding);
  const defaultOptions = {
    minimumFractionDigits: void 0,
    maximumFractionDigits: void 0,
    useGrouping: true,
    percentage: false,
    accessibility: true,
    locale: defaultLocale
  };
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions
  );
  let numericValue;
  let rawValue;
  if (mode === "implicit" || mode === "options") {
    rawValue = extractElementValue(el, "0");
    numericValue = validateNumericValue(rawValue, "Number");
  } else {
    rawValue = value;
    numericValue = validateNumericValue(rawValue, "Number");
  }
  if (numericValue === null) {
    return;
  }
  try {
    const formatterOptions = {
      useGrouping: options.useGrouping,
      minimumFractionDigits: options.minimumFractionDigits,
      maximumFractionDigits: options.maximumFractionDigits
    };
    const formatter = new Intl.NumberFormat(options.locale, formatterOptions);
    let formatted;
    if (options.percentage) {
      formatted = formatter.format(numericValue * 100) + "%";
    } else {
      formatted = formatter.format(numericValue);
    }
    applyCommonAttributes(
      el,
      options,
      formatted,
      "Number",
      {
        "data-number-value": numericValue.toString()
      },
      rawValue
    );
  } catch (error) {
    handleDirectiveError("Number", error, value);
  }
}
const DateTimeDirective = createDirective(formatDateTime);
function formatDateTime(el, binding) {
  const globalOpts = getGlobalOptions();
  const defaultLocale = getDefaultLocale(binding);
  const defaultTimezone = globalOpts.defaultTimezone || "UTC";
  const defaultOptions = {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: defaultTimezone,
    accessibility: true,
    locale: defaultLocale,
    inputFormat: "auto"
  };
  const { mode, value, options } = parseDirectiveBinding(
    binding,
    defaultOptions
  );
  let dateValue;
  let rawValue;
  if (mode === "implicit" || mode === "options") {
    rawValue = extractElementValue(el, "");
    dateValue = validateDateValue(rawValue, "DateTime");
  } else {
    rawValue = value;
    dateValue = validateDateValue(rawValue, "DateTime");
  }
  if (dateValue === null) {
    return;
  }
  try {
    const formatterOptions = {};
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
    applyCommonAttributes(
      el,
      options,
      formatted,
      "Date",
      {
        "data-date-value": dateValue.toISOString(),
        "data-timezone": options.timeZone || "UTC"
      },
      rawValue
    );
  } catch (error) {
    handleDirectiveError("DateTime", error, value);
  }
}
function detectUserLocale() {
  try {
    if (typeof navigator !== "undefined" && navigator.language) {
      return navigator.language;
    }
    if (typeof Intl !== "undefined") {
      const detectedLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
      if (detectedLocale) {
        return detectedLocale;
      }
    }
    return "en-US";
  } catch (error) {
    console.warn("Could not detect user locale:", error);
    return "en-US";
  }
}
function detectUserTimezone() {
  try {
    if (typeof Intl !== "undefined") {
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }
    return "UTC";
  } catch (error) {
    console.warn("Could not detect user timezone:", error);
    return "UTC";
  }
}
function detectUserCurrency(locale) {
  try {
    const userLocale = locale || detectUserLocale();
    if (typeof Intl !== "undefined") {
      const formatter = new Intl.NumberFormat(userLocale, {
        style: "currency",
        currency: getCurrencyForLocale(userLocale)
      });
      const options = formatter.resolvedOptions();
      if (options.currency) {
        return options.currency;
      }
    }
    return "USD";
  } catch (error) {
    console.warn("Could not detect user currency:", error);
    return "USD";
  }
}
function getCurrencyForLocale(locale) {
  const currencyMap = {
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
    "es-US": "USD",
    // Spanish speakers in US
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
    "uk-UA": "UAH"
  };
  if (currencyMap[locale]) {
    return currencyMap[locale];
  }
  const languageCode = locale.split("-")[0];
  const matchingLocale = Object.keys(currencyMap).find(
    (key) => key.startsWith(languageCode + "-")
  );
  if (matchingLocale) {
    return currencyMap[matchingLocale];
  }
  return "USD";
}
function detectUserPreferences() {
  const locale = detectUserLocale();
  const timezone = detectUserTimezone();
  const currency = detectUserCurrency(locale);
  return {
    locale,
    timezone,
    currency
  };
}
function hasBrowserSupport() {
  return {
    intl: typeof Intl !== "undefined",
    dateTimeFormat: typeof Intl !== "undefined" && typeof Intl.DateTimeFormat === "function",
    numberFormat: typeof Intl !== "undefined" && typeof Intl.NumberFormat === "function",
    navigator: typeof navigator !== "undefined" && typeof navigator.language === "string"
  };
}
const formatDirectives = {
  currency: CurrencyDirective,
  number: NumberDirective,
  "date-time": DateTimeDirective
};
let globalOptions = {
  locale: "en-US",
  defaultCurrency: "USD",
  defaultTimezone: "UTC",
  autoDetect: true,
  debug: false
};
const getGlobalOptions = () => globalOptions;
const updateGlobalOptions = (newOptions) => {
  const previousOptions = __spreadValues({}, globalOptions);
  globalOptions = __spreadValues(__spreadValues({}, globalOptions), newOptions);
  if (globalOptions.debug) {
    console.log("VueTextUtils options updated:", {
      previous: previousOptions,
      new: globalOptions,
      changes: newOptions
    });
  }
};
const resetGlobalOptions = () => {
  const autoDetectedPrefs = detectUserPreferences();
  globalOptions = {
    locale: (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.locale) || "en-US",
    defaultCurrency: (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.currency) || "USD",
    defaultTimezone: (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.timezone) || "UTC",
    autoDetect: true,
    debug: false
  };
  if (globalOptions.debug) {
    console.log("VueTextUtils options reset to auto-detected:", globalOptions);
  }
};
const VueTextUtils = {
  install(app, options = {}) {
    var _a, _b;
    const autoDetectedPrefs = options.autoDetect !== false ? detectUserPreferences() : null;
    globalOptions = {
      locale: options.locale || (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.locale) || "en-US",
      defaultCurrency: options.defaultCurrency || (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.currency) || "USD",
      defaultTimezone: options.defaultTimezone || (autoDetectedPrefs == null ? void 0 : autoDetectedPrefs.timezone) || "UTC",
      autoDetect: (_a = options.autoDetect) != null ? _a : true,
      debug: (_b = options.debug) != null ? _b : false
    };
    if (globalOptions.debug) {
      console.log("VueTextUtils initialized with options:", globalOptions);
      if (autoDetectedPrefs) {
        console.log("Auto-detected user preferences:", autoDetectedPrefs);
      }
    }
    app.provide("vueTextUtilsOptions", globalOptions);
    app.provide("updateVueTextUtilsOptions", updateGlobalOptions);
    app.provide("resetVueTextUtilsOptions", resetGlobalOptions);
    app.config.globalProperties.$vueTextUtils = {
      getOptions: getGlobalOptions,
      updateOptions: updateGlobalOptions,
      resetOptions: resetGlobalOptions
    };
    Object.entries(formatDirectives).forEach(([name, directive]) => {
      app.directive(name, directive);
      app.directive(`format.${name}`, directive);
    });
  }
};
export {
  CurrencyDirective,
  DateTimeDirective,
  NumberDirective,
  VueTextUtils,
  detectUserCurrency,
  detectUserLocale,
  detectUserPreferences,
  detectUserTimezone,
  formatDirectives,
  getGlobalOptions,
  hasBrowserSupport,
  resetGlobalOptions,
  updateGlobalOptions
};
//# sourceMappingURL=index.es.js.map
