import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/vue";
import { afterEach, vi } from "vitest";

// jsdom has no native dialog implementation; keep the open/close contract.
Object.defineProperties(HTMLDialogElement.prototype, {
  showModal: {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.setAttribute("open", "");
      this.querySelector<HTMLElement>(
        "[autofocus], button, [href], input, select, textarea, [tabindex]"
      )?.focus();
    },
  },
  close: {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    },
  },
});

Object.defineProperty(window, "scrollTo", { value: vi.fn(), writable: true });

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});
