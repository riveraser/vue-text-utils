import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";

describe("Currency Directive", () => {
  it("should format currency correctly", async () => {
    const wrapper = mount({
      template: '<p v-currency="120">120</p>',
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should contain currency symbol and formatted number
    expect(element.textContent).toMatch(/[£€¥$]/);
    expect(element.textContent).toMatch(/120/);
  });

  it("should work with directive argument for currency type", async () => {
    const wrapper = mount({
      template: '<p v-currency.eur="120">120</p>',
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should format as EUR
    expect(element.textContent).toMatch(/€/);
    expect(element.textContent).toMatch(/120/);
  });

  it("should handle binding options", async () => {
    const wrapper = mount({
      template:
        '<p v-currency="{ currency: "USD", currencyDisplay: "code" }">120</p>',
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should format as USD code
    expect(element.textContent).toContain("USD");
    expect(element.textContent).toMatch(/120/);
  });
});

describe("Number Directive", () => {
  it("should format numbers with grouping", async () => {
    const wrapper = mount({
      template: '<p v-number="1200">1200</p>',
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should have thousand separators
    expect(element.textContent).toMatch(/1,200/);
  });

  it("should format percentage correctly", async () => {
    const wrapper = mount({
      template: '<p v-number="{ percentage: true }">0.25</p>',
    });

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
    const wrapper = mount({
      template: `<p v-date-time="${testDate.toISOString()}">2025-11-01T20:25:20.000Z</p>`,
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should be formatted date
    expect(element.textContent).not.toBe("2025-11-01T20:25:20.000Z");
    expect(element.textContent?.length).toBeGreaterThan(5); // Some formatted text
  });

  it("should handle different date styles", async () => {
    const testDate = new Date("2025-11-01T20:25:20.000Z");
    const wrapper = mount({
      template: `<p v-date-time="{ dateStyle: 'short', timeStyle: 'short' }">${testDate.toISOString()}</p>`,
    });

    await wrapper.vm.$nextTick();
    const element = wrapper.element as HTMLElement;

    // Should have short formatted date and time
    expect(element.textContent).not.toContain("2025-11-01T20:25:20.000Z");
  });
});
