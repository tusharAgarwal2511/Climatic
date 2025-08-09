// favourite-cities.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, vi } from "vitest";
import { describe, expect, it } from "vitest";	
import FavouriteCities from "./favourite-cities";
import { useFavourite } from "@/hooks/use-favourite";
import { useWeatherQuery } from "@/hooks/use-weather";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

vi.mock("@/hooks/use-favourite");
vi.mock("@/hooks/use-weather");
vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        useNavigate: vi.fn(),
    };
});
vi.mock("sonner", () => ({
    toast: {
        error: vi.fn(),
    },
}));

describe("FavouriteCities", () => {
    const mockNavigate = vi.fn();
    const mockRemoveFavourite = { mutate: vi.fn() };

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
    });

    it("renders nothing when there are no favourites", () => {
        (useFavourite as any).mockReturnValue({
            favourites: [],
            removeFavourite: mockRemoveFavourite,
        });

        render(<FavouriteCities />);
        expect(screen.queryByText(/Favourites/i)).not.toBeInTheDocument();
    });

    it("renders a favourite city with weather data", () => {
        (useFavourite as any).mockReturnValue({
            favourites: [{ id: "1", name: "London", lat: 51.5, lon: -0.12 }],
            removeFavourite: mockRemoveFavourite,
        });
        (useWeatherQuery as any).mockReturnValue({
            data: {
                weather: [{ icon: "01d", description: "clear sky" }],
                sys: { country: "GB" },
                main: { temp: 20 },
            },
            isLoading: false,
        });

        render(<FavouriteCities />);
        expect(screen.getByText("London")).toBeInTheDocument();
        expect(screen.getByText("GB")).toBeInTheDocument();
        expect(screen.getByText(/20°/)).toBeInTheDocument();
        expect(screen.getByText(/clear sky/i)).toBeInTheDocument();
    });

    it("navigates to city page when clicking city card", () => {
        (useFavourite as any).mockReturnValue({
            favourites: [{ id: "1", name: "Paris", lat: 48.85, lon: 2.35 }],
            removeFavourite: mockRemoveFavourite,
        });
        (useWeatherQuery as any).mockReturnValue({
            data: {
                weather: [{ icon: "02d", description: "cloudy" }],
                sys: { country: "FR" },
                main: { temp: 25 },
            },
            isLoading: false,
        });

        render(<FavouriteCities />);
        fireEvent.click(screen.getByRole("button", { name: /Paris/i }));

        expect(mockNavigate).toHaveBeenCalledWith(
            "/city/Paris?lat=48.85&lon=2.35"
        );
    });

    it("removes city and shows toast on remove click", () => {
        (useFavourite as any).mockReturnValue({
            favourites: [{ id: "1", name: "Berlin", lat: 52.52, lon: 13.4 }],
            removeFavourite: mockRemoveFavourite,
        });
        (useWeatherQuery as any).mockReturnValue({
            data: {
                weather: [{ icon: "03d", description: "scattered clouds" }],
                sys: { country: "DE" },
                main: { temp: 18 },
            },
            isLoading: false,
        });

        render(<FavouriteCities />);

        // The second button inside the card is the remove button
        const removeBtn = screen.getAllByRole("button")[1];
        fireEvent.click(removeBtn);

        expect(mockRemoveFavourite.mutate).toHaveBeenCalledWith("1");
        expect(toast.error).toHaveBeenCalledWith(
            "Removed Berlin from favourites"
        );
    });

    it("shows loader when weather is loading", () => {
        (useFavourite as any).mockReturnValue({
            favourites: [{ id: "1", name: "Rome", lat: 41.9, lon: 12.5 }],
            removeFavourite: mockRemoveFavourite,
        });
        (useWeatherQuery as any).mockReturnValue({
            data: undefined,
            isLoading: true,
        });

        render(<FavouriteCities />);

        // Check loader by its spin class
        expect(document.querySelector(".animate-spin")).toBeInTheDocument();
    });
});
