# vue-text-utils

A lightweight Vue 3 plugin offering a collection of custom directives for formatting text directly in your templates. Format currency, numbers, and date-time values with intuitive syntax like `v-format.currency`, `v-format.number`, and `v-format.date-time`. Designed for internationalization, accessibility, and rapid development.

## 🎯 [Live Demo](https://riveraser.github.io/vue-text-utils/)

Check out the interactive demo to see all features in action!

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
<!-- Currency formatting (explicit - uses binding value) -->
<p v-currency="120"></p>
<!-- Output: $120.00 -->

<p v-currency:EUR="120"></p>
<!-- Output: €120.00 -->

<!-- Number formatting (explicit) -->
<p v-number="1250"></p>
<!-- Output: 1,250 -->

<!-- Date-time formatting (explicit) -->
<p v-date-time="'2025-11-01T20:25:20.000Z'"></p>
<!-- Output: 11/1/2025, 8:25:20 PM -->
```

### Prefixed Usage (also available):

```html
<!-- Explicit usage (uses binding value) -->
<p v-format.currency="120"></p>
<p v-format.number="1250"></p>
<p v-format.date-time="'2025-11-01T20:25:20.000Z'"></p>
```

### Advanced Usage with Options:

```html
<!-- Currency with options -->
<p v-currency="{ value: 120, currency: 'USD', currencyDisplay: 'code' }"></p>
<!-- Output: USD 120.00 -->

<!-- Number as percentage -->
<p v-number="{ value: 0.25, percentage: true }"></p>
<!-- Output: 25% -->

<!-- Date with custom style -->
<p
  v-date-time="{ value: '2025-11-01T20:25:20.000Z', dateStyle: 'short', timeStyle: 'short' }"
></p>
<!-- Output: 11/1/25, 8:25 PM -->
```

## Real-World Example: Automatic Localization

```vue
<template>
  <!-- These will automatically show in user's local format -->
  <div class="product-card">
    <h3>{{ product.name }}</h3>

    <!-- Price shows in user's currency automatically -->
    <p class="price" v-currency="product.price"></p>

    <!-- Date shows in user's timezone automatically -->
    <p class="date" v-date-time="product.createdAt"></p>

    <!-- Numbers formatted according to user's locale -->
    <p class="views" v-number="product.views"></p>
  </div>
</template>

<script setup>
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

### Directive Modes:

**Explicit Mode** (recommended - supports reactivity):

- Pass the value as a binding to the directive
- Syntax: `<p v-currency="price"></p>`
- The directive uses the binding value and updates when the value changes
- **Fully reactive** - updates automatically when data changes
- Best for dynamic values from component data

**Explicit Mode with Options**:

- Pass both value and formatting options as an object
- Syntax: `<p v-currency="{ value: price, currency: 'EUR' }"></p>`
- Include a `value` property in the options object
- **Fully reactive** - updates when `price` changes

**Explicit Mode with Argument**:

- Use directive argument for common options like currency
- Syntax: `<p v-currency:EUR="price"></p>`
- Cleaner syntax for single option overrides
- **Fully reactive**

Example:

```vue
<script setup>
import { ref } from "vue";
const price = ref(100);
const updatePrice = () => (price.value = 200);
</script>

<template>
  <!-- All of these are reactive and will update when price changes -->
  <p v-currency="price"></p>
  <p v-currency:EUR="price"></p>
  <p
    v-currency="{ value: price, currency: 'GBP', currencyDisplay: 'code' }"
  ></p>

  <button @click="updatePrice">Update Price</button>
</template>
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
