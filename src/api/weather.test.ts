// weather.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { weatherAPI } from "./weather";
import type {
    Coordinates,
    WeatherData,
    ForecastData,
    GeocodingResponse,
} from "./types";
import { API_CONFIG } from "./config";

describe("WeatherAPI", () => {
    const mockCoords: Coordinates = { lat: 12.34, lon: 56.78 };

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it("should fetch current weather", async () => {
        const mockWeather: WeatherData = {
            coord: mockCoords,
            weather: [
                { id: 1, main: "Clear", description: "clear sky", icon: "01d" },
            ],
            main: {
                temp: 25,
                feels_like: 25,
                temp_min: 20,
                temp_max: 30,
                pressure: 1012,
                humidity: 50,
            },
            wind: { speed: 5, deg: 180 },
            sys: { sunrise: 123456, sunset: 123999, country: "IN" },
            name: "Test City",
            dt: 123456789,
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockWeather),
        }) as unknown as typeof fetch;

        const data = await weatherAPI.getCurrentWeather(mockCoords);
        expect(data).toEqual(mockWeather);

        const expectedUrl = `${API_CONFIG.BASE_URL}/weather?appid=${API_CONFIG.API_KEY}&lat=12.34&lon=56.78&units=${API_CONFIG.DEFAULT_PARAMS.units}`;
        expect(fetch).toHaveBeenCalledWith(expectedUrl);
    });

    it("should fetch forecast data", async () => {
        const mockForecast: ForecastData = {
            list: [],
            city: {
                name: "Test City",
                country: "IN",
                sunrise: 123,
                sunset: 456,
            },
        };

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockForecast),
        }) as unknown as typeof fetch;

        const data = await weatherAPI.getForecast(mockCoords);
        expect(data).toEqual(mockForecast);
    });

    it("should reverse geocode coordinates", async () => {
        const mockGeo: GeocodingResponse[] = [
            { name: "Test City", lat: 12.34, lon: 56.78, country: "IN" },
        ];

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockGeo),
        }) as unknown as typeof fetch;

        const data = await weatherAPI.reverseGeocode(mockCoords);
        expect(data).toEqual(mockGeo);
    });

    it("should search locations by query", async () => {
        const mockGeo: GeocodingResponse[] = [
            { name: "Another City", lat: 11.11, lon: 22.22, country: "US" },
        ];

        global.fetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockGeo),
        }) as unknown as typeof fetch;

        const data = await weatherAPI.searchLocations("Another City");
        expect(data).toEqual(mockGeo);
    });

    it("should throw error when fetch fails", async () => {
        global.fetch = vi.fn().mockResolvedValue({
            ok: false,
            statusText: "Not Found",
        }) as unknown as typeof fetch;

        await expect(weatherAPI.getCurrentWeather(mockCoords)).rejects.toThrow(
            "Weather API Error: Not Found"
        );
    });
});
