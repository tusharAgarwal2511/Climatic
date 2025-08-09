import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useLocalStorage } from "./use-local-storage";

describe("useLocalStorage", () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it("should return initial value when localStorage is empty", () => {
        const { result } = renderHook(() => useLocalStorage("key", "default"));

        const [value] = result.current;
        expect(value).toBe("default");
    });

    it("should read value from localStorage if present", () => {
        localStorage.setItem("key", JSON.stringify("storedValue"));

        const { result } = renderHook(() => useLocalStorage("key", "default"));
        const [value] = result.current;

        expect(value).toBe("storedValue");
    });

    it("should update localStorage when state changes", () => {
        const { result } = renderHook(() => useLocalStorage("key", "default"));

        act(() => {
            const [, setValue] = result.current;
            setValue("newValue");
        });

        const [value] = result.current;
        expect(value).toBe("newValue");
        expect(localStorage.getItem("key")).toBe(JSON.stringify("newValue"));
    });

    it("should handle JSON parse errors gracefully", () => {
        localStorage.setItem("key", "{ bad json }");

        const { result } = renderHook(() => useLocalStorage("key", "default"));
        const [value] = result.current;

        expect(value).toBe("default");
    });
});
