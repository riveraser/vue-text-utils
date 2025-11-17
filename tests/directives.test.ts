import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import CurrencyDirective from "../src/directives/currency";
import NumberDirective from "../src/directives/number";
import DateTimeDirective from "../src/directives/datetime";
describe("Currency Directive", () => {
  it("should format currency correctly with explicit mode", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="120"></p>',
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
        template: '<p v-currency:EUR="120"></p>',
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

  it("should handle options with value property", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="options"></p>',
        data() {
          return {
            options: { value: 120, currency: "USD", currencyDisplay: "code" },
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

  it("should be reactive to data changes", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="price"></p>',
        data() {
          return {
            price: 99.99,
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
    let element = wrapper.element as HTMLElement;
    const initialText = element.textContent;

    // Should contain initial price
    expect(initialText).toMatch(/99/);

    // Update the price
    await wrapper.setData({ price: 199.99 });
    await wrapper.vm.$nextTick();

    element = wrapper.element as HTMLElement;
    const updatedText = element.textContent;

    // Should contain updated price
    expect(updatedText).toMatch(/199/);
    expect(updatedText).not.toBe(initialText);
  });

  it("should be reactive with options object containing value", async () => {
    const wrapper = mount(
      {
        template: '<p v-currency="options"></p>',
        data() {
          return {
            options: { value: 50, currency: "EUR" },
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
    let element = wrapper.element as HTMLElement;
    const initialText = element.textContent;

    expect(initialText).toMatch(/50/);
    expect(initialText).toMatch(/€/);

    // Update the value in options
    await wrapper.setData({ options: { value: 150, currency: "EUR" } });
    await wrapper.vm.$nextTick();

    element = wrapper.element as HTMLElement;
    const updatedText = element.textContent;

    expect(updatedText).toMatch(/150/);
    expect(updatedText).not.toBe(initialText);
  });
});

describe("Number Directive", () => {
  it("should format numbers with grouping", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="1200"></p>',
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

  it("should format percentage correctly with options", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="options"></p>',
        data() {
          return {
            options: { value: 0.25, percentage: true },
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

  it("should be reactive to number changes", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="count"></p>',
        data() {
          return {
            count: 1000,
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
    let element = wrapper.element as HTMLElement;
    expect(element.textContent).toMatch(/1,000/);

    // Update the count
    await wrapper.setData({ count: 5000 });
    await wrapper.vm.$nextTick();

    element = wrapper.element as HTMLElement;
    expect(element.textContent).toMatch(/5,000/);
  });

  it("should handle decimal formatting options", async () => {
    const wrapper = mount(
      {
        template: '<p v-number="options"></p>',
        data() {
          return {
            options: {
              value: 123.456789,
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            },
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

    // Should format with 2 decimal places
    expect(element.textContent).toMatch(/123\.46/);
  });
});

describe("DateTime Directive", () => {
  it("should format dates correctly", async () => {
    const testDate = new Date("2025-11-01T20:25:20.000Z");
    const wrapper = mount(
      {
        template: '<p v-date-time="testDate"></p>',
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

  it("should handle different date styles with options", async () => {
    const wrapper = mount(
      {
        template: '<p v-date-time="options"></p>',
        data() {
          return {
            options: {
              value: "2025-11-01T20:25:20.000Z",
              dateStyle: "short",
              timeStyle: "short",
            },
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
    expect(element.textContent?.length).toBeGreaterThan(3);
  });

  it("should be reactive to date changes", async () => {
    const wrapper = mount(
      {
        template: '<p v-date-time="currentDate"></p>',
        data() {
          return {
            currentDate: "2025-11-01T10:00:00.000Z",
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
    let element = wrapper.element as HTMLElement;
    const initialText = element.textContent;

    // Update the date
    await wrapper.setData({ currentDate: "2025-12-25T10:00:00.000Z" });
    await wrapper.vm.$nextTick();

    element = wrapper.element as HTMLElement;
    const updatedText = element.textContent;

    // Text should have changed
    expect(updatedText).not.toBe(initialText);
    expect(updatedText?.length).toBeGreaterThan(3);
  });

  it("should work with options object for timezone", async () => {
    const wrapper = mount(
      {
        template: '<p v-date-time="options"></p>',
        data() {
          return {
            options: {
              value: "2025-11-01T20:25:20.000Z",
              timeZone: "America/New_York",
              dateStyle: "medium",
              timeStyle: "medium",
            },
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

    // Should have formatted date with timezone
    expect(element.textContent).not.toBe("2025-11-01T20:25:20.000Z");
    expect(element.textContent?.length).toBeGreaterThan(5);
  });
});
