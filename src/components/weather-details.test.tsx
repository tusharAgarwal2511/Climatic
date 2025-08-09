import { render, screen } from "@testing-library/react";
import WeatherDetails from "./weather-details";
import type { WeatherData } from "@/api/types";
import { describe, expect, it } from "vitest";

const mockWeatherData: WeatherData = {
    coord: { lat: 12.34, lon: 56.78 },
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
        pressure: 1013,
        humidity: 40,
    },
    wind: {
        speed: 5,
        deg: 135,
    },
    sys: {
        sunrise: 1672496400, // UNIX timestamp in seconds
        sunset: 1672539600,
        country: "IN",
    },
    name: "TestCity",
    dt: 1672520000,
};

describe("WeatherDetails", () => {
    it("renders all weather details correctly", () => {
        render(<WeatherDetails data={mockWeatherData} />);

        expect(screen.getByText("Weather Details")).toBeInTheDocument();

        // Titles
        expect(screen.getByText("Sunrise")).toBeInTheDocument();
        expect(screen.getByText("Sunset")).toBeInTheDocument();
        expect(screen.getByText("Wind Direction")).toBeInTheDocument();
        expect(screen.getByText("Pressure")).toBeInTheDocument();

        // Values
        // Check both sunrise and sunset times include am/pm by getting all matches
        const timeElements = screen.getAllByText(/am|pm/i);
        expect(timeElements.length).toBeGreaterThanOrEqual(2);

        expect(screen.getByText("SE (135°)")).toBeInTheDocument();
        expect(screen.getByText("1013 hPa")).toBeInTheDocument();
    });
});
