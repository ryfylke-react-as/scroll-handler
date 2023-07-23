import "@testing-library/dom";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import { ScrollHandler } from "../../dist/cjs/index";

describe("ScrollHandler", () => {
  test("should render", () => {
    const scrollHandler = new ScrollHandler();
    expect(scrollHandler).toBeDefined();
  });
});
