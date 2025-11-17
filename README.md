# vue-text-utils

A lightweight Vue 3 plugin offering a collection of custom directives for formatting text directly in your templates. Format currency, numbers, and date-time values with intuitive syntax like `v-format.currency`, `v-format.number`, and `v-format.date-time`. Designed for internationalization, accessibility, and rapid development.

## Install Instructions:

```bash
npm install @riveraser/vue-text-utils
```

## Register Globally:

```js
import { createApp } from "vue";
import App from "./App.vue";
import { VueTextUtils } from "@riveraser/vue-text-utils";

const app = createApp(App);
app.use(VueTextUtils);
app.mount("#app");
```

## Automatic Browser Detection (Default):

By default, Vue Text Utils automatically detects your user's preferences from their browser:

```js
import { createApp } from "vue";
import App from "./App.vue";
import { VueTextUtils } from "@riveraser/vue-text-utils";

const app = createApp(App);
// Auto-detects user's locale, timezone, and currency from browser
app.use(VueTextUtils);
app.mount("#app");
```

## Register with Custom Global Options:

```js
import { createApp } from "vue";
import App from "./App.vue";
import { VueTextUtils } from "@riveraser/vue-text-utils";

const app = createApp(App);
app.use(VueTextUtils, {
  locale: "es-ES", // Override auto-detected locale
  defaultCurrency: "EUR", // Override auto-detected currency
  defaultTimezone: "Europe/Madrid", // Override auto-detected timezone
  autoDetect: false, // Disable auto-detection (use only specified options)
  debug: true, // Enable debug logging
});
app.mount("#app");
```

## Manual Detection Utilities:

You can also use the detection utilities independently:

```js
import {
  detectUserPreferences,
  detectUserLocale,
  detectUserTimezone,
  detectUserCurrency,
} from "@riveraser/vue-text-utils";

// Get all user preferences at once
const userPrefs = detectUserPreferences();
console.log(userPrefs);
// { locale: 'en-US', timezone: 'America/New_York', currency: 'USD' }

// Or detect individually
const locale = detectUserLocale(); // 'en-US'
const timezone = detectUserTimezone(); // 'America/New_York'
const currency = detectUserCurrency(); // 'USD'
```

## Register Individual Directives:

```js
import { createApp } from "vue";
import App from "./App.vue";
import {
  CurrencyDirective,
  NumberDirective,
  DateTimeDirective,
} from "@riveraser/vue-text-utils";

const app = createApp(App);
app.directive("currency", CurrencyDirective);
app.directive("number", NumberDirective);
app.directive("date-time", DateTimeDirective);
app.mount("#app");
```

## Usage:

### Basic Usage:

```html
<!-- Currency formatting (implicit - reads value from element content) -->
<p v-currency>120</p>
<!-- Output: $120.00 -->
<p v-currency:EUR>120</p>
<!-- Output: €120.00 -->

<!-- Currency formatting (explicit - uses binding value) -->
<p v-currency="120">Price will be replaced</p>
<p v-currency:EUR="120">Price will be replaced</p>

<!-- Number formatting (implicit) -->
<p v-number>1250</p>
<!-- Output: 1,250 -->

<!-- Number formatting (explicit) -->
<p v-number="1250">Number will be replaced</p>

<!-- Date-time formatting (implicit) -->
<p v-date-time>2025-11-01T20:25:20.000Z</p>

<!-- Date-time formatting (explicit) -->
<p v-date-time="'2025-11-01T20:25:20.000Z'">Date will be replaced</p>
```

### Prefixed Usage (also available):

```html
<!-- Implicit usage (reads from element content) -->
<p v-format.currency>120</p>
<p v-format.number>1250</p>
<p v-format.date-time>2025-11-01T20:25:20.000Z</p>

<!-- Explicit usage (uses binding value) -->
<p v-format.currency="120">Content replaced</p>
<p v-format.number="1250">Content replaced</p>
<p v-format.date-time="'2025-11-01T20:25:20.000Z'">Content replaced</p>
```

### Advanced Usage with Options:

```html
<!-- Currency with options -->
<p v-currency="{ currency: 'USD', currencyDisplay: 'code' }">120</p>

<!-- Number as percentage -->
<p v-number="{ percentage: true }">0.25</p>

<!-- Date with custom style -->
<p v-date-time="{ dateStyle: 'short', timeStyle: 'short' }">
  2025-11-01T20:25:20.000Z
</p>
```

## Real-World Example: Automatic Localization

```vue
<template>
  <!-- These will automatically show in user's local format -->
  <div class="product-card">
    <h3>{{ product.name }}</h3>

    <!-- Price shows in user's currency automatically (implicit mode) -->
    <p class="price" v-currency>{{ product.price }}</p>

    <!-- Date shows in user's timezone automatically (implicit mode) -->
    <p class="date" v-date-time>{{ product.createdAt }}</p>

    <!-- Numbers formatted according to user's locale (implicit mode) -->
    <p class="views" v-number>{{ product.views }}</p>
  </div>
</template>

<script setup>
import { VueTextUtils } from "@riveraser/vue-text-utils";

// Auto-detection enabled by default - no configuration needed!
// German user sees: 120,00 €, 1.234.567 views, 13.11.2025 format
// US user sees: $120.00, 1,234,567 views, 11/13/2025 format
// Japanese user sees: ¥120, 1,234,567 views, 2025/11/13 format

const product = {
  name: "Awesome Product",
  price: 120,
  createdAt: "2025-11-13T10:30:00Z", // UTC from server
  views: 1234567,
};
</script>
```

## Configuration Priority:

The directives use the following priority order for locale and formatting options:

1. **Directive-specific options** (highest priority)
2. **Vue i18n locale** (if available)
3. **Global plugin options**
4. **Built-in defaults** (lowest priority)

### Implicit vs Explicit Mode:

**Implicit Mode** (recommended for most cases):

- Use when the value to format is already in the element's content
- Syntax: `<p v-currency>120</p>`
- The directive reads the value from the element's text content
- Cleaner, more intuitive syntax

**Explicit Mode**:

- Use when you need to pass the value as a binding
- Syntax: `<p v-currency="120">Content gets replaced</p>`
- The directive uses the binding value and replaces element content
- Useful for dynamic values from component data

**Options Mode**:

- Pass formatting options as an object
- Works with both implicit and explicit modes
- Implicit: `<p v-currency="{ currency: 'EUR' }">120</p>`
- Explicit: `<p v-currency="{ value: 120, currency: 'EUR' }">Replaced</p>`

Example:

```js
// Global options set EUR as default
app.use(VueTextUtils, { defaultCurrency: "EUR", locale: "de-DE" });

// Implicit mode with directive option override (USD overrides global EUR)
<p v-currency:USD>100</p>

// Explicit mode with global defaults (uses EUR from global options)
<p v-currency="100">Content replaced with formatted value</p>
```

## Global Options:

## Global Options:

| Option            | Type    | Default                    | Description                          |
| ----------------- | ------- | -------------------------- | ------------------------------------ |
| `locale`          | string  | Auto-detected or `"en-US"` | Default locale for all formatting    |
| `defaultCurrency` | string  | Auto-detected or `"USD"`   | Default currency code                |
| `defaultTimezone` | string  | Auto-detected or `"UTC"`   | Default timezone for date formatting |
| `autoDetect`      | boolean | `true`                     | Enable automatic browser detection   |
| `debug`           | boolean | `false`                    | Enable debug logging                 |

## Auto-Detection Features:

Vue Text Utils automatically detects user preferences from their browser:

- **Locale**: Detected from `navigator.language` and `Intl.DateTimeFormat`
- **Timezone**: Detected from `Intl.DateTimeFormat().resolvedOptions().timeZone`
- **Currency**: Inferred from locale using comprehensive locale-to-currency mapping

### Supported Auto-Detection:

- ✅ **120+ locales** with currency mapping
- ✅ **All IANA timezones** supported by browser
- ✅ **Fallback system** for unsupported environments
- ✅ **Real-time detection** - no configuration needed

### Example Auto-Detection Results:

| User Location     | Auto-Detected Settings                                                |
| ----------------- | --------------------------------------------------------------------- | -------- | ------------------------------------ |
| 🇺🇸 USA            | `locale: 'en-US'`, `currency: 'USD'`, `timezone: 'America/New_York'`  |
| 🇩🇪 Germany        | `locale: 'de-DE'`, `currency: 'EUR'`, `timezone: 'Europe/Berlin'`     |
| 🇯🇵 Japan          | `locale: 'ja-JP'`, `currency: 'JPY'`, `timezone: 'Asia/Tokyo'`        |
| 🇧🇷 Brazil         | `locale: 'pt-BR'`, `currency: 'BRL'`, `timezone: 'America/Sao_Paulo'` | "en-US"` | Default locale for all formatting    |
| `defaultCurrency` | string                                                                | `"USD"`  | Default currency code                |
| `defaultTimezone` | string                                                                | `"UTC"`  | Default timezone for date formatting |
| `debug`           | boolean                                                               | `false`  | Enable debug logging                 |
