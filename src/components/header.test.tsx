// src/components/header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import Header from "./header";
import { beforeEach, describe, expect, it, vi } from "vitest";

// Mock react-router-dom Link to just render children
vi.mock("react-router-dom", () => ({
    Link: ({ children }: { children: React.ReactNode }) => (
        <div>{children}</div>
    ),
}));

// Mock lucide-react icons as simple divs for testing
vi.mock("lucide-react", () => ({
    Moon: () => <div data-testid="moon-icon" />,
    Sun: () => <div data-testid="sun-icon" />,
}));

// Mock CitySearch component
vi.mock("./city-search", () => ({
    default: () => <div>CitySearch Component</div>,
}));

// Mock theme context hook
const mockSetTheme = vi.fn();

vi.mock("@/context/theme-provider", () => ({
    useTheme: () => ({
        theme: currentTheme,
        setTheme: mockSetTheme,
    }),
}));

// We'll control this variable in tests
let currentTheme = "light";

describe("Header", () => {
    beforeEach(() => {
        mockSetTheme.mockReset();
    });

    it("renders logo for light theme", () => {
        currentTheme = "light";
        render(<Header />);
        const logo = screen.getByAltText("Logo") as HTMLImageElement;
        expect(logo.src).toContain("/logo.png");
    });

    it("renders logo for dark theme", () => {
        currentTheme = "dark";
        render(<Header />);
        const logo = screen.getByAltText("Logo") as HTMLImageElement;
        expect(logo.src).toContain("/logo.png");
    });

    it("renders CitySearch component", () => {
        currentTheme = "light";
        render(<Header />);
        expect(screen.getByText("CitySearch Component")).toBeDefined();
    });

    it("renders Moon icon for light theme", () => {
        currentTheme = "light";
        render(<Header />);
        expect(screen.getByTestId("moon-icon")).toBeDefined();
    });

    it("renders Sun icon for dark theme", () => {
        currentTheme = "dark";
        render(<Header />);
        expect(screen.getByTestId("sun-icon")).toBeDefined();
    });

    it("calls setTheme with 'dark' when current theme is light and icon clicked", () => {
        currentTheme = "light";
        render(<Header />);
        const div = document.querySelector("div.cursor-pointer");
        if (!div) throw new Error("Toggle div not found");

        fireEvent.click(div);
        expect(mockSetTheme).toHaveBeenCalledWith("dark");
    });

    it("calls setTheme with 'light' when current theme is dark and icon clicked", () => {
        currentTheme = "dark";
        render(<Header />);
        const div = document.querySelector("div.cursor-pointer");
        if (!div) throw new Error("Toggle div not found");

        fireEvent.click(div);
        expect(mockSetTheme).toHaveBeenCalledWith("light");
    });
});
