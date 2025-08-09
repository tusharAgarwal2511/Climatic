import "@testing-library/jest-dom";
import { vi } from "vitest";

// Polyfill ResizeObserver for Vitest/JSDOM
class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
}
(global as any).ResizeObserver = ResizeObserver;
Element.prototype.scrollIntoView = vi.fn();