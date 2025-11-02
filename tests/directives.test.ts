import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CurrencyDirective from "../src/directives/currency";
import NumberDirective from "../src/directives/number";
import DateTimeDirective from "../src/directives/datetime";
describe("Currency Directive", () => {
  it("should format currency correctly", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="120">120</p>',
      },
      {
        global: {
          directives: {
            currency: CurrencyDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should contain currency symbol and formatted number
    expect(element.textContent).toMatch(/[$£€¥]/);
    expect(element.textContent).toMatch(/120/);
  });

  it("should work with directive argument for currency type", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency:EUR="120">120</p>',
      },
      {
        global: {
          directives: {
            currency: CurrencyDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should format as EUR
    expect(element.textContent).toMatch(/€/);
    expect(element.textContent).toMatch(/120/);
  });

  it("should handle binding options", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="options">120</p>',
        data() {
          return {
            options: { currency: "USD", currencyDisplay: "code" },
          };
        },
      },
      {
        global: {
          directives: {
            currency: CurrencyDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should format as USD code
    expect(element.textContent).toContain("USD");
    expect(element.textContent).toMatch(/120/);
  });
});

describe("Number Directive", () => {
  it("should format numbers with grouping", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="1200">1200</p>',
      },
      {
        global: {
          directives: {
            number: NumberDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should have thousand separators
    expect(element.textContent).toMatch(/1,200/);
  });

  it("should format percentage correctly", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="options">0.25</p>',
        data() {
          return {
            options: { percentage: true },
          };
        },
      },
      {
        global: {
          directives: {
            number: NumberDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should format as percentage
    expect(element.textContent).toContain("25");
    expect(element.textContent).toContain("%");
  });
});

describe("DateTime Directive", () => {
  it("should format dates correctly", async () => {
    const testDate = new Date("2025-11-01T20:25:20.000Z");
    const wrapper = mount(
      {
        template: '<p v-date-time="testDate">2025-11-01T20:25:20.000Z</p>',
        data() {
          return {
            testDate: testDate.toISOString(),
          };
        },
      },
      {
        global: {
          directives: {
            "date-time": DateTimeDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should be formatted date
    expect(element.textContent).not.toBe("2025-11-01T20:25:20.000Z");
    expect(element.textContent?.length).toBeGreaterThan(5); // Some formatted text
  });

  it("should handle different date styles", async () => {
    const wrapper = mount(
      {
        template: '<p v-date-time="options">2025-11-01T20:25:20.000Z</p>',
        data() {
          return {
            options: { dateStyle: "short", timeStyle: "short" },
          };
        },
      },
      {
        global: {
          directives: {
            "date-time": DateTimeDirective,
          },
        },
      },
    );

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should have short formatted date and time
    expect(element.textContent).not.toContain("2025-11-01T20:25:20.000Z");
  });
});
