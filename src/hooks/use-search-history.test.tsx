import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach } from "vitest";
import { useSearchHistory } from "./use-search-history";

function createWrapper() {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}

describe("useSearchHistory", () => {
    beforeEach(() => {
        localStorage.clear();
    });

    it("should start with an empty history", () => {
        const { result } = renderHook(() => useSearchHistory(), {
            wrapper: createWrapper(),
        });

        expect(result.current.history).toEqual([]);
    });

    it("should add a search to history", async () => {
        const { result } = renderHook(() => useSearchHistory(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.addToHistory.mutate({
                query: "London",
                name: "London",
                state: "England",
                country: "UK",
                lat: 51.5072,
                lon: -0.1276,
            });
        });

        await waitFor(() => {
            expect(result.current.history).toHaveLength(1);
            expect(result.current.history[0].query).toBe("London");
        });
    });

    it("should clear the history", async () => {
        const { result } = renderHook(() => useSearchHistory(), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.addToHistory.mutate({
                query: "London",
                name: "London",
                state: "England",
                country: "UK",
                lat: 51.5072,
                lon: -0.1276,
            });
        });

        await waitFor(() => {
            expect(result.current.history).toHaveLength(1);
        });

        act(() => {
            result.current.clearHistory.mutate();
        });

        await waitFor(() => {
            expect(result.current.history).toEqual([]);
        });
    });
});
