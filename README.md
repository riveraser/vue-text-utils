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

## Register with Global Options:

```js
import { createApp } from "vue";
import App from "./App.vue";
import { VueTextUtils } from "@riveraser/vue-text-utils";

const app = createApp(App);
app.use(VueTextUtils, {
  locale: "es-ES", // Default locale for all directives
  defaultCurrency: "EUR", // Default currency for currency directive
  defaultTimezone: "Europe/Madrid", // Default timezone for date directive
  debug: true, // Enable debug logging
});
app.mount("#app");
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
<!-- Currency formatting -->
<p v-currency="120">120</p>
<p v-currency:EUR="120">120</p>

<!-- Number formatting -->
<p v-number="1250">1250</p>

<!-- Date-time formatting -->
<p v-date-time="'2025-11-01T20:25:20.000Z'">2025-11-01T20:25:20.000Z</p>
```

### Prefixed Usage (also available):

```html
<p v-format.currency="120">120</p>
<p v-format.number="1250">1250</p>
<p v-format.date-time="'2025-11-01T20:25:20.000Z'">2025-11-01T20:25:20.000Z</p>
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

## Configuration Priority:

The directives use the following priority order for locale and formatting options:

1. **Directive-specific options** (highest priority)
2. **Vue i18n locale** (if available)
3. **Global plugin options**
4. **Built-in defaults** (lowest priority)

Example:

```js
// Global options set EUR as default
app.use(VueTextUtils, { defaultCurrency: "EUR", locale: "de-DE" });

// This will use USD (directive option overrides global)
<p v-currency="{ currency: 'USD' }">100</p>

// This will use EUR (from global options)
<p v-currency="100">100</p>
```

## Global Options:

| Option            | Type    | Default   | Description                          |
| ----------------- | ------- | --------- | ------------------------------------ |
| `locale`          | string  | `"en-US"` | Default locale for all formatting    |
| `defaultCurrency` | string  | `"USD"`   | Default currency code                |
| `defaultTimezone` | string  | `"UTC"`   | Default timezone for date formatting |
| `debug`           | boolean | `false`   | Enable debug logging                 |
