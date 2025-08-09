// use-favourite.test.tsx
import React from "react";
import { renderHook, act } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFavourite } from "./use-favourite";
import * as useLocalStorageModule from "./use-local-storage";
import { beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";
import type { Mock } from "vitest";

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const mockSetFavourites = vi.fn();

vi.mock("./use-local-storage", () => ({
    useLocalStorage: vi.fn(() => [[], mockSetFavourites]),
}));

describe("useFavourite simple tests", () => {
    beforeEach(() => {
        mockSetFavourites.mockReset();
        queryClient.clear(); // reset cache if needed
    });

    it("starts with empty favourites", () => {
        const { result } = renderHook(() => useFavourite(), { wrapper });
        expect(result.current.favourites).toEqual([]);
    });

    it("adds a new favourite city", async () => {
        const { result } = renderHook(() => useFavourite(), { wrapper });
        const city = {
            name: "Paris",
            lat: 48.8566,
            lon: 2.3522,
            country: "FR",
        };

        await act(async () => {
            await result.current.addFavourite.mutate(city);
        });

        expect(mockSetFavourites).toHaveBeenCalled();
    });

    it("does not add duplicates", async () => {
        const mockedUseLocalStorage =
            useLocalStorageModule.useLocalStorage as Mock;

        mockedUseLocalStorage.mockReturnValueOnce([
            [
                {
                    id: "48.8566-2.3522",
                    name: "Paris",
                    lat: 48.8566,
                    lon: 2.3522,
                    country: "FR",
                    addedAt: Date.now(),
                },
            ],
            mockSetFavourites,
        ]);

        const { result } = renderHook(() => useFavourite(), { wrapper });

        await act(async () => {
            await result.current.addFavourite.mutate({
                name: "Paris",
                lat: 48.8566,
                lon: 2.3522,
                country: "FR",
            });
        });

        expect(mockSetFavourites).not.toHaveBeenCalled();
    });

    it("removes a favourite city", async () => {
        const mockedUseLocalStorage =
            useLocalStorageModule.useLocalStorage as Mock;

        mockedUseLocalStorage.mockReturnValueOnce([
            [
                {
                    id: "48.8566-2.3522",
                    name: "Paris",
                    lat: 48.8566,
                    lon: 2.3522,
                    country: "FR",
                    addedAt: Date.now(),
                },
            ],
            mockSetFavourites,
        ]);

        const { result } = renderHook(() => useFavourite(), { wrapper });

        await act(async () => {
            await result.current.removeFavourite.mutate("48.8566-2.3522");
        });

        expect(mockSetFavourites).toHaveBeenCalledWith([]);
    });

    it("checks if city is favourite", () => {
        const mockedUseLocalStorage =
            useLocalStorageModule.useLocalStorage as Mock;

        mockedUseLocalStorage.mockReturnValueOnce([
            [
                {
                    id: "48.8566-2.3522",
                    name: "Paris",
                    lat: 48.8566,
                    lon: 2.3522,
                    country: "FR",
                    addedAt: Date.now(),
                },
            ],
            mockSetFavourites,
        ]);

        const { result } = renderHook(() => useFavourite(), { wrapper });

        expect(result.current.isFavourite(48.8566, 2.3522)).toBe(true);
        expect(result.current.isFavourite(0, 0)).toBe(false);
    });
});
