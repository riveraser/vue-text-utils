# vue-text-utils

A lightweight Vue 3 plugin offering a collection of custom directives for formatting text directly in your templates. Format currency, numbers, and date-time values with intuitive syntax like `v-format.currency`, `v-format.number`, and `v-format.date-time`. Designed for internationalization, accessibility, and rapid development.

## Install Instructions:

```bash
npm install @sergiorivera/vue-text-utils
```

## Register Globally:

```js
import { createApp } from "vue";
import App from "./App.vue";
import VueTextUtils from "@sergiorivera/vue-text-utils";

const app = createApp(App);
app.use(VueTextUtils);
app.mount("#app");
```

## Usage:

```html
<p v-format.currency>120</p>
<p v-format.number>1250</p>
<p v-format.date-time>2025-11-01 20:25:20.000EST</p>
```
