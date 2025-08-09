// src/pages/city-page.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CityPage from "./city-page";

vi.mock("@/hooks/use-weather", () => ({
    useWeatherQuery: vi.fn(),
    useForecastQuery: vi.fn(),
}));

vi.mock("react-router-dom", () => ({
    useParams: vi.fn(),
    useSearchParams: vi.fn(),
}));

vi.mock("@/components/current-weather", () => ({
    default: () => <div>CurrentWeather Component</div>,
}));
vi.mock("@/components/favourite-button", () => ({
    default: () => <div>FavouriteButton Component</div>,
}));
vi.mock("@/components/hourly-temperature", () => ({
    default: () => <div>HourlyTemperature Component</div>,
}));
vi.mock("@/components/loading-skeleton", () => ({
    default: () => <div>LoadingSkeleton Component</div>,
}));
vi.mock("@/components/ui/alert", () => ({
    Alert: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
    AlertTitle: ({ children }: { children: React.ReactNode }) => (
        <h2>{children}</h2>
    ),
    AlertDescription: ({ children }: { children: React.ReactNode }) => (
        <p>{children}</p>
    ),
}));

import { useWeatherQuery, useForecastQuery } from "@/hooks/use-weather";
import { useParams, useSearchParams } from "react-router-dom";

describe("CityPage", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading skeleton when data or cityName is missing", () => {
        (useParams as any).mockReturnValue({ cityName: "TestCity" });
        (useSearchParams as any).mockReturnValue([
            new URLSearchParams("lat=12.34&lon=56.78"),
        ]);
        (useWeatherQuery as any).mockReturnValue({
            data: null,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });
        (useForecastQuery as any).mockReturnValue({
            data: null,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(<CityPage />);
        expect(screen.getByText("LoadingSkeleton Component")).toBeDefined();
    });

    it("renders error alert when weather or forecast query has error", () => {
        (useParams as any).mockReturnValue({ cityName: "TestCity" });
        (useSearchParams as any).mockReturnValue([
            new URLSearchParams("lat=12.34&lon=56.78"),
        ]);
        (useWeatherQuery as any).mockReturnValue({
            data: null,
            error: new Error("fail"),
            refetch: vi.fn(),
            isFetching: false,
        });
        (useForecastQuery as any).mockReturnValue({
            data: null,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(<CityPage />);
        expect(screen.getByText("Error")).toBeDefined();
        expect(
            screen.getByText("Failed to fetch weather data. Please try again")
        ).toBeDefined();
    });

    it("renders city weather components when data is available", () => {
        const weatherData = {
            sys: { country: "IN", sunrise: 1660000000, sunset: 1660040000 },
            name: "TestCity",
            main: { temp: 20 },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            wind: { speed: 5, deg: 180 },
            dt: 1660001234,
            coord: { lat: 12.34, lon: 56.78 },
        };
        const forecastData = { list: [] };

        (useParams as any).mockReturnValue({ cityName: "TestCity" });
        (useSearchParams as any).mockReturnValue([
            new URLSearchParams("lat=12.34&lon=56.78"),
        ]);
        (useWeatherQuery as any).mockReturnValue({
            data: weatherData,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });
        (useForecastQuery as any).mockReturnValue({
            data: forecastData,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(<CityPage />);

        expect(screen.getByText("FavouriteButton Component")).toBeDefined();
        expect(screen.getByText("CurrentWeather Component")).toBeDefined();
        expect(screen.getByText("HourlyTemperature Component")).toBeDefined();

        expect(screen.getByText("TestCity, IN")).toBeDefined();
    });

    it("renders loading skeleton if cityName param is missing", () => {
        (useParams as any).mockReturnValue({});
        (useSearchParams as any).mockReturnValue([
            new URLSearchParams("lat=12.34&lon=56.78"),
        ]);
        (useWeatherQuery as any).mockReturnValue({
            data: {
                sys: { country: "IN", sunrise: 1660000000, sunset: 1660040000 },
            },
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });
        (useForecastQuery as any).mockReturnValue({
            data: { list: [] },
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(<CityPage />);
        expect(screen.getByText("LoadingSkeleton Component")).toBeDefined();
    });
});
