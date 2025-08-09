// src/components/layout.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import Layout from "./layout";

vi.mock("./header", () => ({
    default: () => <div>Header Component</div>,
}));

describe("Layout", () => {
    it("renders header, footer, and children", () => {
        render(
            <Layout>
                <div>Page Content</div>
            </Layout>
        );
        expect(screen.getByText("Header Component")).toBeDefined();
        expect(screen.getByText("Page Content")).toBeDefined();
        expect(screen.getByText("Made by Tushar Agarwal")).toBeDefined();
    });
});
