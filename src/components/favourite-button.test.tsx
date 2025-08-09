// favourite-button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { vi, beforeEach, describe, it, expect } from "vitest";

let toastSuccessMock: ReturnType<typeof vi.fn>;
let toastErrorMock: ReturnType<typeof vi.fn>;
let addFavouriteMutateMock: ReturnType<typeof vi.fn>;
let removeFavouriteMutateMock: ReturnType<typeof vi.fn>;
let isFavouriteMock: ReturnType<typeof vi.fn>;

vi.mock("sonner", () => {
    toastSuccessMock = vi.fn();
    toastErrorMock = vi.fn();
    return {
        toast: {
            success: toastSuccessMock,
            error: toastErrorMock,
        },
    };
});

vi.mock("@/hooks/use-favourite", () => {
    addFavouriteMutateMock = vi.fn();
    removeFavouriteMutateMock = vi.fn();
    isFavouriteMock = vi.fn();
    return {
        useFavourite: () => ({
            addFavourite: { mutate: addFavouriteMutateMock },
            removeFavourite: { mutate: removeFavouriteMutateMock },
            isFavourite: isFavouriteMock,
        }),
    };
});

describe("FavouriteButton", () => {
    // Import component **after mocks** to avoid hoisting issues
    let FavouriteButton: typeof import("./favourite-button").default;

    beforeEach(async () => {
        vi.clearAllMocks();
        // dynamic import after mocks are set
        FavouriteButton = (await import("./favourite-button")).default;
    });

    const weatherData = {
        coord: { lat: 12.34, lon: 56.78 },
        weather: [],
        main: {
            temp: 25,
            feels_like: 26,
            temp_min: 20,
            temp_max: 30,
            pressure: 1010,
            humidity: 50,
        },
        wind: { speed: 5, deg: 180 },
        sys: { sunrise: 0, sunset: 0, country: "IN" },
        name: "TestCity",
        dt: 0,
    };

    it("renders button with outline variant when not favourite", () => {
        isFavouriteMock.mockReturnValue(false);
        render(<FavouriteButton data={weatherData} />);
        const button = screen.getByRole("button");

        // You can check for the outline variant by its classes (e.g., border, bg-background)
        expect(button).toHaveClass("border");
        expect(button).toHaveClass("bg-background");
        expect(button.querySelector("svg")).not.toHaveClass("fill-current");
    });

    it("renders button with default variant and yellow bg when favourite", () => {
        isFavouriteMock.mockReturnValue(true);
        render(<FavouriteButton data={weatherData} />);
        const button = screen.getByRole("button");

        expect(button).toHaveClass("bg-yellow-500");
        expect(button.querySelector("svg")).toHaveClass("fill-current");
    });

    it("calls addFavourite.mutate and shows success toast when adding favourite", () => {
        isFavouriteMock.mockReturnValue(false);
        render(<FavouriteButton data={weatherData} />);
        fireEvent.click(screen.getByRole("button"));

        expect(addFavouriteMutateMock).toHaveBeenCalledWith({
            name: "TestCity",
            lat: 12.34,
            lon: 56.78,
            country: "IN",
        });
        expect(toastSuccessMock).toHaveBeenCalledWith(
            "Added TestCity to favourites"
        );
    });

    it("calls removeFavourite.mutate and shows error toast when removing favourite", () => {
        isFavouriteMock.mockReturnValue(true);
        render(<FavouriteButton data={weatherData} />);
        fireEvent.click(screen.getByRole("button"));

        expect(removeFavouriteMutateMock).toHaveBeenCalledWith("12.34-56.78");
        expect(toastErrorMock).toHaveBeenCalledWith(
            "Removed TestCity from favourites"
        );
    });
});
