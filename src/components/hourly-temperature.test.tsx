import { render, screen } from "@testing-library/react";
import HourlyTemperature from "./hourly-temperature";
import type { ForecastData } from "@/api/types";
import { beforeEach, describe, expect, it } from "vitest";

const mockData: ForecastData = {
    list: Array.from({ length: 8 }, (_, i) => ({
        dt: 1680950400 + i * 3600, 
        main: {
            temp: 20 + i,
            feels_like: 19 + i,
            temp_min: 0,
            temp_max: 0,
            pressure: 1010,
            humidity: 50,
        },
        weather: [],
        wind: { speed: 0, deg: 0 },
        dt_txt: "",
    })),
    city: {
        name: "TestCity",
        country: "TC",
        sunrise: 0,
        sunset: 0,
    },
};

describe("HourlyTemperature", () => {
    beforeEach(() => {
        render(<HourlyTemperature data={mockData} />);
    });

    it("renders the title", () => {
        expect(screen.getByText("Today's Temperature")).toBeInTheDocument();
    });

    it("does not show tooltip content initially", () => {
        expect(screen.queryByTestId("tooltip-content")).toBeNull();
    });
});
