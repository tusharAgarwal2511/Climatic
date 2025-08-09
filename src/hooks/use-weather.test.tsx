import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
    useWeatherQuery,
    useForecastQuery,
    useReverseGeocodeQuery,
    useLocationSearch,
} from "./use-weather";
import { weatherAPI } from "@/api/weather";
import { beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";	

// Mock the entire weatherAPI module
vi.mock("@/api/weather", () => ({
    weatherAPI: {
        getCurrentWeather: vi.fn(),
        getForecast: vi.fn(),
        reverseGeocode: vi.fn(),
        searchLocations: vi.fn(),
    },
}));

const createWrapper = () => {
    const queryClient = new QueryClient();
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
};

describe("useWeather hooks", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("fetches current weather", async () => {
        (weatherAPI.getCurrentWeather as any).mockResolvedValue({ temp: 25 });

        const { result } = renderHook(
            () => useWeatherQuery({ lat: 10, lon: 20 }),
            { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.data).toEqual({ temp: 25 }));
    });

    it("fetches forecast", async () => {
        (weatherAPI.getForecast as any).mockResolvedValue({ list: [1, 2, 3] });

        const { result } = renderHook(
            () => useForecastQuery({ lat: 10, lon: 20 }),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual({ list: [1, 2, 3] })
        );
    });

    it("fetches reverse geocode", async () => {
        (weatherAPI.reverseGeocode as any).mockResolvedValue({ city: "Paris" });

        const { result } = renderHook(
            () => useReverseGeocodeQuery({ lat: 10, lon: 20 }),
            { wrapper: createWrapper() }
        );

        await waitFor(() =>
            expect(result.current.data).toEqual({ city: "Paris" })
        );
    });

    it("fetches location search", async () => {
        (weatherAPI.searchLocations as any).mockResolvedValue([
            { name: "London" },
        ]);

        const { result } = renderHook(() => useLocationSearch("Lon"), {
            wrapper: createWrapper(),
        });

        await waitFor(() =>
            expect(result.current.data).toEqual([{ name: "London" }])
        );
    });
});
