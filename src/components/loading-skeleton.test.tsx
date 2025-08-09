// src/components/loading-skeleton.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherSkeleton from "./loading-skeleton";

// Mock the Skeleton component to a simple div with a test id
vi.mock("./ui/skeleton", () => ({
    Skeleton: (props: any) => <div data-testid="skeleton" {...props} />,
}));

describe("WeatherSkeleton", () => {
    it("renders all skeleton elements", () => {
        render(<WeatherSkeleton />);

        // There should be 4 Skeleton components rendered
        const skeletons = screen.getAllByTestId("skeleton");
        expect(skeletons).toHaveLength(4);

        // Check the container div exists by querying className (optional)
        const container = document.querySelector("div.space-y-6");
        expect(container).toBeTruthy();
    });
});
