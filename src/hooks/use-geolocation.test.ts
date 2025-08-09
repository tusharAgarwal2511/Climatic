import { renderHook, waitFor } from "@testing-library/react";
import { useGeolocation } from "./use-geolocation";
import { afterAll, beforeAll} from "vitest";
import { describe, expect, it } from "vitest";	

describe("useGeolocation", () => {
    let originalGeolocation: Geolocation;

    beforeAll(() => {
        originalGeolocation = navigator.geolocation;
    });

    afterAll(() => {
        // restore original geolocation
        // @ts-expect-error restoring mock
        navigator.geolocation = originalGeolocation;
    });

    it("returns coordinates on success", async () => {
        // @ts-expect-error mocking
        navigator.geolocation = {
            getCurrentPosition: (
                success: (pos: GeolocationPosition) => void
            ) => {
                success({
                    coords: {
                        latitude: 12.34,
                        longitude: 56.78,
                        accuracy: 0,
                        altitude: null,
                        altitudeAccuracy: null,
                        heading: null,
                        speed: null,
                        toJSON: () => ({}),
                    },
                    timestamp: Date.now(),
                    toJSON: function () {
                        throw new Error("Function not implemented.");
                    }
                });
            },
        };

        const { result } = renderHook(() => useGeolocation());

        await waitFor(() => {
            expect(result.current.coordinates).toEqual({
                lat: 12.34,
                lon: 56.78,
            });
            expect(result.current.error).toBeNull();
            expect(result.current.isLoading).toBe(false);
        });
    });

    it("handles browser not supporting geolocation", async () => {
        // @ts-expect-error mocking
        navigator.geolocation = undefined;

        const { result } = renderHook(() => useGeolocation());

        await waitFor(() => {
            expect(result.current.coordinates).toBeNull();
            expect(result.current.error).toBe(
                "Geolocation is not supported by your browser"
            );
            expect(result.current.isLoading).toBe(false);
        });
    });

    it("handles permission denied error", async () => {
        // @ts-expect-error mocking
        navigator.geolocation = {
            getCurrentPosition: (
                _success: (pos: GeolocationPosition) => void,
                error: (err: GeolocationPositionError) => void
            ) => {
                error({
                    code: 1,
                    message: "Permission denied",
                    PERMISSION_DENIED: 1,
                    POSITION_UNAVAILABLE: 2,
                    TIMEOUT: 3,
                } as GeolocationPositionError);
            },
        };

        const { result } = renderHook(() => useGeolocation());

        await waitFor(() => {
            expect(result.current.coordinates).toBeNull();
            expect(result.current.error).toBe(
                "Location permission denied. Please enable location access"
            );
            expect(result.current.isLoading).toBe(false);
        });
    });
});
