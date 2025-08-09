import { render, screen } from "@testing-library/react";
import { WeatherForecast } from "./weather-forecast";
import type { ForecastData } from "@/api/types";
import { describe, expect, it } from "vitest";

const mockData: ForecastData = {
    list: [
        {
            dt: 1672502400, // 2023-12-31
            main: {
                temp: 15,
                feels_like: 14,
                temp_min: 10,
                temp_max: 20,
                pressure: 1012,
                humidity: 60,
            },
            weather: [
                {
                    id: 500,
                    main: "Rain",
                    description: "light rain",
                    icon: "10d",
                },
            ],
            wind: {
                speed: 3.5,
                deg: 90,
            },
            dt_txt: "2023-12-31 12:00:00",
        },
        {
            dt: 1672588800, // 2024-01-01
            main: {
                temp: 18,
                feels_like: 17,
                temp_min: 13,
                temp_max: 22,
                pressure: 1015,
                humidity: 55,
            },
            weather: [
                {
                    id: 800,
                    main: "Clear",
                    description: "clear sky",
                    icon: "01d",
                },
            ],
            wind: {
                speed: 4.1,
                deg: 80,
            },
            dt_txt: "2024-01-01 12:00:00",
        },
    ],
    city: {
        name: "Test City",
        country: "TC",
        sunrise: 1672489200,
        sunset: 1672532400,
    },
};

describe("WeatherForecast", () => {
    it("renders forecast cards with correct data", () => {
        render(<WeatherForecast data={mockData} />);

        expect(screen.getByText("5-Day Forecast")).toBeInTheDocument();

        expect(screen.getByText(/Dec 31/)).toBeInTheDocument();
        expect(screen.getByText(/Jan 1/)).toBeInTheDocument();

        expect(screen.getByText("light rain")).toBeInTheDocument();
        expect(screen.getByText("clear sky")).toBeInTheDocument();

        expect(screen.getAllByText(/°/).length).toBeGreaterThanOrEqual(4);

        // Check humidity: there may be multiple, so check length
        const humidityElements = screen.getAllByText(/60%|55%/);
        expect(humidityElements.length).toBeGreaterThanOrEqual(2);

        // Similarly for wind speed, which can also appear multiple times
        const windElements = screen.getAllByText(/3.5 m\/s|4.1 m\/s/);
        expect(windElements.length).toBeGreaterThanOrEqual(2);
    });
});
