import "@testing-library/dom";
import "@testing-library/jest-dom";
import { describe, expect, vi } from "vitest";
import { ScrollHandler } from "../../dist/cjs/index";
import { fireEvent, waitFor } from "@testing-library/dom";
import { d } from "vitest/dist/types-e3c9754d";

// Mock for `Element.scrollTo` method
Element.prototype.scrollTo = function (options) {
  this.scrollTop = options.top;
  this.__offsetTop = options.top;

  this.dispatchEvent(
    new CustomEvent("scroll", {
      detail: {
        target: this,
      },
    })
  );
};

// Mock for `Element.getBoundingClientRect` method
window.HTMLElement.prototype.getBoundingClientRect =
  function () {
    return {
      width: parseFloat(this.style.width) || 0,
      height: parseFloat(this.style.height) || 0,
      top: parseFloat(this.style.marginTop) || 0,
      left: parseFloat(this.style.marginLeft) || 0,
      x: parseFloat(this.style.marginLeft) || 0,
      y: parseFloat(this.style.marginTop) || 0,
      bottom: parseFloat(this.style.marginTop) || 0,
      right: parseFloat(this.style.marginLeft) || 0,
      toJSON: () => "",
    };
  };

// Mock for ResizeObserver
window.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// Mock for MutationObserver
window.MutationObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
} as any;

describe("ScrollHandler", () => {
  afterEach(() => {
    document.body.innerHTML = "";
  });
  test("default target is document", async () => {
    const fn = vi.fn();
    const div = document.createElement("div");
    div.innerHTML = `<div style="height:500vh">.</div>hello`;
    document.body.appendChild(div);
    const scrollHandler = new ScrollHandler().onScroll(() => {
      fn();
    });
    await fireEvent.scroll(document, {
      target: { scrollY: 100 },
    });
    expect(fn.mock.calls.length).toBe(0);
    scrollHandler.enable();
    await fireEvent.scroll(document, {
      target: { scrollY: 100 },
    });
    await waitFor(() => expect(fn).toHaveBeenCalled());
  });

  test("can pass custom target", async () => {
    const fn = vi.fn();
    const div = document.createElement("div");
    div.innerHTML = `<div style="height:500vh"></div><div>Hello</div>"`;
    div.style.overflow = "scroll";
    div.style.maxHeight = "100vh";
    document.body.appendChild(div);
    const scrollHandler = new ScrollHandler({
      target: div,
    }).onScroll(() => {
      fn();
    });
    div.scrollTo({
      top: 100,
    });
    expect(fn.mock.calls.length).toBe(0);
    scrollHandler.enable();
    div.scrollTo({
      top: 100,
    });
    await waitFor(() => expect(fn).toHaveBeenCalled());
  });

  test("between", async () => {
    const fn = vi.fn();
    const div = document.createElement("div");
    div.innerHTML = `<div style="height:5000px"></div><div>Hello</div>"`;
    div.style.overflow = "scroll";
    div.style.maxHeight = "500px";
    document.body.appendChild(div);
    const scrollHandler = new ScrollHandler({
      target: div,
    }).between(0, 100, () => {
      fn();
    });
    scrollHandler.enable();
    div.scrollTo({
      top: 50,
    });
    div.scrollTo({
      top: 100,
    });
    await waitFor(() => expect(fn).toHaveBeenCalled());
    fn.mockClear();
    div.scrollTo({
      top: 150,
    });
    await waitFor(() => expect(fn).not.toHaveBeenCalled());
    div.scrollTo({
      top: 110,
    });
    await waitFor(() => expect(fn).not.toHaveBeenCalled());
    div.scrollTo({
      top: 50,
    });
    await waitFor(() => expect(fn).toHaveBeenCalled());
  });

  test("onceOver", async () => {
    const fn = vi.fn();
    const div = document.createElement("div");
    div.innerHTML = `<div style="height:5000px"></div><div>Hello</div>"`;
    div.style.overflow = "scroll";
    div.style.maxHeight = "500px";
    document.body.appendChild(div);
    const scrollHandler = new ScrollHandler({
      target: div,
    }).onceOver(500, () => {
      fn();
    });
    scrollHandler.enable();
    div.scrollTo({
      top: 450,
    });
    await waitFor(() => expect(fn).not.toHaveBeenCalled());
    div.scrollTo({
      top: 550,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledOnce());
    div.scrollTo({
      top: 700,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledOnce());
    div.scrollTo({
      top: 400,
    });
    div.scrollTo({
      top: 600,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });

  test("onceUnder", async () => {
    const fn = vi.fn();
    const div = document.createElement("div");
    div.innerHTML = `<div style="height:5000px"></div><div>Hello</div>"`;
    div.style.overflow = "scroll";
    div.style.maxHeight = "500px";
    document.body.appendChild(div);
    const scrollHandler = new ScrollHandler({
      target: div,
    }).onceUnder(500, () => {
      fn();
    });
    scrollHandler.enable();
    div.scrollTo({
      top: 450,
    });
    await waitFor(() => expect(fn).not.toHaveBeenCalled());
    div.scrollTo({
      top: 550,
    });
    await waitFor(() => expect(fn).not.toHaveBeenCalled());
    div.scrollTo({
      top: 450,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledOnce());
    div.scrollTo({
      top: 700,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledOnce());
    div.scrollTo({
      top: 400,
    });
    await waitFor(() => expect(fn).toHaveBeenCalledTimes(2));
  });
});
