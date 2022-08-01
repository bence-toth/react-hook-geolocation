import useGeolocation from "./index";
import { renderHook, act } from "@testing-library/react";

const mockGetCurrentPosition = jest.fn();
const mockWatchPosition = jest.fn();
const mockClearWatch = jest.fn();

const mockGeolocation = {
  getCurrentPosition: mockGetCurrentPosition,
  watchPosition: mockWatchPosition,
  clearWatch: mockClearWatch,
};

global.navigator.geolocation = mockGeolocation;

describe("useGeolocation", () => {
  it("reads initial geolocation", () => {
    const mockCoordinates = {
      latitude: 12.3456789,
      longitude: 34.5678912,
      altitude: null,
      accuracy: 12.345,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    mockGetCurrentPosition.mockImplementationOnce((success) =>
      Promise.resolve(
        success({
          coords: {
            latitude: 12.3456789,
            longitude: 34.5678912,
            altitude: null,
            accuracy: 12.345,
            altitudeAccuracy: null,
            heading: null,
            speed: null,
          },
        })
      )
    );
    const { result } = renderHook(() => useGeolocation());

    expect(result.current).toStrictEqual({
      ...mockCoordinates,
      timestamp: undefined,
      error: null,
    });
  });
});
