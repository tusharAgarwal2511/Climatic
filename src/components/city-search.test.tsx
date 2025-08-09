// src/components/city-search.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CitySearch from "./city-search";
import { MemoryRouter } from "react-router-dom";

// Mock hooks
vi.mock("@/hooks/use-weather", () => ({
    useLocationSearch: vi.fn(),
}));

vi.mock("@/hooks/use-search-history", () => ({
    useSearchHistory: vi.fn(),
}));

vi.mock("@/hooks/use-favourite", () => ({
    useFavourite: vi.fn(),
}));

// Mock useNavigate from react-router-dom
vi.mock("react-router-dom", async (importOriginal) => {
    const actual: any = await importOriginal();
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

import { useLocationSearch } from "@/hooks/use-weather";
import { useSearchHistory } from "@/hooks/use-search-history";
import { useFavourite } from "@/hooks/use-favourite";

describe("CitySearch component", () => {
    beforeEach(() => {
        vi.clearAllMocks();

        (useLocationSearch as any).mockReturnValue({
            data: [],
            isLoading: false,
        });

        (useSearchHistory as any).mockReturnValue({
            history: [],
            clearHistory: { mutate: vi.fn() },
            addToHistory: { mutate: vi.fn() },
        });

        (useFavourite as any).mockReturnValue({
            favourites: [],
        });
    });

    it("renders search button", () => {
        render(
            <MemoryRouter>
                <CitySearch />
            </MemoryRouter>
        );

        expect(screen.getByText(/search cities/i)).toBeInTheDocument();
    });

    it("opens dialog when search button is clicked", async () => {
        render(
            <MemoryRouter>
                <CitySearch />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /search cities/i }));

        // Matches "Search cities...."
        expect(
            await screen.findByPlaceholderText(/search cities/i)
        ).toBeInTheDocument();
    });

    it("shows favourites when provided", async () => {
        (useFavourite as any).mockReturnValue({
            favourites: [
                {
                    id: 1,
                    name: "Paris",
                    lat: 1,
                    lon: 2,
                    country: "FR",
                    state: "Ile-de-France",
                },
            ],
        });

        render(
            <MemoryRouter>
                <CitySearch />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /search cities/i }));

        expect(await screen.findByText(/paris/i)).toBeInTheDocument();
    });

    it("shows recent search history when provided", async () => {
        (useSearchHistory as any).mockReturnValue({
            history: [
                {
                    name: "London",
                    lat: 3,
                    lon: 4,
                    country: "GB",
                    state: "England",
                    searchedAt: new Date(),
                },
            ],
            clearHistory: { mutate: vi.fn() },
            addToHistory: { mutate: vi.fn() },
        });

        render(
            <MemoryRouter>
                <CitySearch />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByRole("button", { name: /search cities/i }));

        expect(await screen.findByText(/london/i)).toBeInTheDocument();
    });
});
