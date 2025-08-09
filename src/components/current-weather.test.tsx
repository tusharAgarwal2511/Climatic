// src/components/current-weather.test.tsx
import { render, screen } from "@testing-library/react";
import CurrentWeather from "./current-weather";
import type { WeatherData, GeocodingResponse } from "@/api/types";
import { describe, it, expect } from "vitest";

describe("CurrentWeather component", () => {
    const mockWeather: WeatherData = {
        coord: { lat: 12.97, lon: 77.59 },
        weather: [
            {
                id: 800,
                main: "Clear",
                description: "clear sky",
                icon: "01d",
            },
        ],
        main: {
            temp: 30,
            feels_like: 32,
            temp_min: 28,
            temp_max: 33,
            pressure: 1012,
            humidity: 60,
        },
        wind: {
            speed: 3.5,
            deg: 90,
        },
        sys: {
            sunrise: 1627884000,
            sunset: 1627930800,
            country: "IN",
        },
        name: "Bengaluru",
        dt: 1627900000,
    };

    const mockLocation: GeocodingResponse = {
        name: "Bengaluru",
        lat: 12.97,
        lon: 77.59,
        country: "IN",
    };

    it("renders location name and country", () => {
        render(
            <CurrentWeather data={mockWeather} locationName={mockLocation} />
        );
        expect(screen.getByText(/Bengaluru/i)).toBeInTheDocument();
        // Use exact match to avoid multiple "IN" matches
        expect(screen.getByText(/^IN$/)).toBeInTheDocument();
    });

    it("renders temperatures correctly", () => {
        render(
            <CurrentWeather data={mockWeather} locationName={mockLocation} />
        );
        expect(screen.getByText("30°")).toBeInTheDocument();
        expect(screen.getByText("Feels like 32°")).toBeInTheDocument();
        expect(screen.getByText("28°")).toBeInTheDocument();
        expect(screen.getByText("33°")).toBeInTheDocument();
    });

    it("renders humidity and wind speed", () => {
        render(
            <CurrentWeather data={mockWeather} locationName={mockLocation} />
        );
        expect(screen.getByText(/humidity/i)).toBeInTheDocument();
        expect(screen.getByText("60%")).toBeInTheDocument();
        expect(screen.getByText(/wind speed/i)).toBeInTheDocument();
        expect(screen.getByText(/3.5 m\/s/)).toBeInTheDocument();
    });

    it("renders weather description and icon", () => {
        render(
            <CurrentWeather data={mockWeather} locationName={mockLocation} />
        );
        expect(screen.getByText(/clear sky/i)).toBeInTheDocument();

        const img = screen.getByRole("img", { name: /clear sky/i });
        expect(img).toHaveAttribute(
            "src",
            expect.stringContaining("01d@4x.png")
        );
    });
});
