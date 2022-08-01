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
          coords: mockCoordinates,
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

  it("updates geolocation from watcher", () => {
    const mockCoordinatesFirst = {
      latitude: 12.3456789,
      longitude: 34.5678912,
      altitude: null,
      accuracy: 12.345,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    mockGetCurrentPosition.mockImplementationOnce((updateCoordinates) =>
      Promise.resolve(
        updateCoordinates({
          coords: mockCoordinatesFirst,
        })
      )
    );

    const mockCoordinatesSecond = {
      latitude: 23.4567891,
      longitude: 45.6789123,
      altitude: null,
      accuracy: 2.3456,
      altitudeAccuracy: null,
      heading: null,
      speed: null,
    };

    const mockTimestamp = 1659386826480;

    mockWatchPosition.mockImplementationOnce((updateCoordinates) =>
      Promise.resolve(
        updateCoordinates({
          coords: mockCoordinatesSecond,
          timestamp: mockTimestamp,
        })
      )
    );

    const { result } = renderHook(() => useGeolocation());

    expect(result.current).toStrictEqual({
      ...mockCoordinatesSecond,
      timestamp: mockTimestamp,
      error: null,
    });
  });
});
