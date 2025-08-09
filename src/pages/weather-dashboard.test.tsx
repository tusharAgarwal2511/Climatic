// src/components/weather-dashboard.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import WeatherDashboard from "./weather-dashboard";

const mockWeatherData = {
    coord: { lat: 12.34, lon: 56.78 },
    weather: [
        { id: 800, main: "Clear", description: "clear sky", icon: "01d" },
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
    sys: {
        sunrise: 1660000000,
        sunset: 1660040000,
        country: "IN",
    },
    name: "Test City",
    dt: 1660001234,
};

// Mock all hooks used in WeatherDashboard
vi.mock("@/hooks/use-geolocation", () => ({
    useGeolocation: vi.fn(),
}));
vi.mock("@/hooks/use-weather", () => ({
    useWeatherQuery: vi.fn(),
    useForecastQuery: vi.fn(),
    useReverseGeocodeQuery: vi.fn(),
}));

// Mock components inside WeatherDashboard
vi.mock("@/components/current-weather", () => ({
    default: () => <div>CurrentWeather Component</div>,
}));
vi.mock("@/components/favourite-cities", () => ({
    default: () => <div>FavouriteCities Component</div>,
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
vi.mock("@/components/ui/button", () => ({
    Button: ({
        children,
        onClick,
        disabled,
    }: {
        children: React.ReactNode;
        onClick?: () => void;
        disabled?: boolean;
    }) => (
        <button disabled={disabled} onClick={onClick}>
            {children}
        </button>
    ),
}));

import { useGeolocation } from "@/hooks/use-geolocation";
import {
    useWeatherQuery,
    useForecastQuery,
    useReverseGeocodeQuery,
} from "@/hooks/use-weather";

describe("WeatherDashboard", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading skeleton while location is loading", () => {
        (useGeolocation as any).mockReturnValue({
            coordinates: null,
            error: null,
            getLocation: vi.fn(),
            isLoading: true,
        });

        render(<WeatherDashboard />);
        expect(screen.getByText("LoadingSkeleton Component")).toBeDefined();
    });

    it("shows location error alert when geolocation has error", () => {
        const getLocationMock = vi.fn();
        (useGeolocation as any).mockReturnValue({
            coordinates: null,
            error: "Location permission denied",
            getLocation: getLocationMock,
            isLoading: false,
        });

        render(<WeatherDashboard />);

        expect(screen.getByText("Location Error")).toBeDefined();
        expect(screen.getByText("Location permission denied")).toBeDefined();

        const button = screen.getByRole("button", { name: /enable location/i });
        fireEvent.click(button);
        expect(getLocationMock).toHaveBeenCalled();
    });

    it("shows alert when no coordinates and no error", () => {
        const getLocationMock = vi.fn();
        (useGeolocation as any).mockReturnValue({
            coordinates: null,
            error: null,
            getLocation: getLocationMock,
            isLoading: false,
        });

        render(<WeatherDashboard />);
        expect(screen.getByText("Location Required")).toBeDefined();

        const button = screen.getByRole("button", { name: /enable location/i });
        fireEvent.click(button);
        expect(getLocationMock).toHaveBeenCalled();
    });

    it("shows error alert if weather or forecast query has error", () => {
        const getLocationMock = vi.fn();
        (useGeolocation as any).mockReturnValue({
            coordinates: { lat: 10, lon: 10 },
            error: null,
            getLocation: getLocationMock,
            isLoading: false,
        });
        (useReverseGeocodeQuery as any).mockReturnValue({
            data: [{ name: "Test City" }],
        });
        (useWeatherQuery as any).mockReturnValue({
            data: null,
            error: new Error("Error"),
            refetch: vi.fn(),
            isFetching: false,
        });
        (useForecastQuery as any).mockReturnValue({
            data: null,
            error: null,
            refetch: vi.fn(),
            isFetching: false,
        });

        render(<WeatherDashboard />);

        expect(screen.getByText("Error")).toBeDefined();
        expect(
            screen.getByText("Failed to fetch weather data. Please try again")
        ).toBeDefined();

        const retryButton = screen.getByRole("button", { name: /retry/i });
        fireEvent.click(retryButton);
        expect(getLocationMock).toHaveBeenCalled();
    });

    it("renders weather dashboard components when data is available", () => {
        const getLocationMock = vi.fn();

        const weatherRefetchMock = vi.fn();
        const forecastRefetchMock = vi.fn();
        const reverseGeocodeRefetchMock = vi.fn();

        (useGeolocation as any).mockReturnValue({
            coordinates: { lat: 10, lon: 10 },
            error: null,
            getLocation: getLocationMock,
            isLoading: false,
        });

        (useReverseGeocodeQuery as any).mockReturnValue({
            data: [{ name: "Test City" }],
            refetch: reverseGeocodeRefetchMock,
        });

        (useWeatherQuery as any).mockReturnValue({
            data: mockWeatherData,
            error: null,
            refetch: weatherRefetchMock,
            isFetching: false,
        });

        (useForecastQuery as any).mockReturnValue({
            data: { list: [] },
            error: null,
            refetch: forecastRefetchMock,
            isFetching: false,
        });

        render(<WeatherDashboard />);

        expect(screen.getByText("FavouriteCities Component")).toBeDefined();
        expect(screen.getByText("CurrentWeather Component")).toBeDefined();
        expect(screen.getByText("HourlyTemperature Component")).toBeDefined();

        const refreshButton = screen.getByRole("button");
        fireEvent.click(refreshButton);

        expect(weatherRefetchMock).toHaveBeenCalled();
        expect(forecastRefetchMock).toHaveBeenCalled();
        expect(reverseGeocodeRefetchMock).toHaveBeenCalled();
    });
});
