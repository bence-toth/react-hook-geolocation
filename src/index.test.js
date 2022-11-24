import useGeolocation from "./index";
import { renderHook } from "@testing-library/react";

const mockGetCurrentPosition = jest.fn();
const mockWatchPosition = jest.fn();
const mockClearWatch = jest.fn();
const mockCallback = jest.fn();

const mockGeolocation = {
  getCurrentPosition: mockGetCurrentPosition,
  watchPosition: mockWatchPosition,
  clearWatch: mockClearWatch,
};

global.navigator.geolocation = mockGeolocation;

const successHandler = (data, returnValue) => (onSuccess) => {
  Promise.resolve(onSuccess(data));
  return returnValue;
};

const errorHandler = (data) => (_, onError) => {
  Promise.resolve(onError(data));
};

describe("useGeolocation", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe("when geolocation data is available", () => {
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
      mockGetCurrentPosition.mockImplementationOnce(
        successHandler({ coords: mockCoordinates })
      );

      const { result } = renderHook(() => useGeolocation({}, mockCallback));

      expect(result.current).toStrictEqual({
        ...mockCoordinates,
        timestamp: undefined,
        error: null,
        isLoading: false,
      });

      requestAnimationFrame(() => {
        expect(mockCallback).toHaveBeenCalledWith({
          ...mockCoordinates,
          timestamp: undefined,
          error: null,
          isLoading: false,
        });
      });
    });

    it("updates geolocation from watch", () => {
      const mockCoordinatesInitial = {
        latitude: 12.3456789,
        longitude: 34.5678912,
        altitude: null,
        accuracy: 12.345,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };
      mockGetCurrentPosition.mockImplementationOnce(
        successHandler({ coords: mockCoordinatesInitial })
      );

      const mockCoordinatesWatch = {
        latitude: 23.4567891,
        longitude: 45.6789123,
        altitude: null,
        accuracy: 2.3456,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };
      const mockTimestamp = 1659386826480;
      mockWatchPosition.mockImplementationOnce(
        successHandler({
          coords: mockCoordinatesWatch,
          timestamp: mockTimestamp,
        })
      );

      const { result } = renderHook(() => useGeolocation({}, mockCallback));

      expect(result.current).toStrictEqual({
        ...mockCoordinatesWatch,
        timestamp: mockTimestamp,
        error: null,
        isLoading: false,
      });

      requestAnimationFrame(() => {
        expect(mockCallback).toHaveBeenCalledTimes(2);
        expect(mockCallback).toHaveBeenCalledWith({
          ...mockCoordinatesInitial,
          timestamp: undefined,
          error: null,
          isLoading: false,
        });
        expect(mockCallback).toHaveBeenCalledWith({
          ...mockCoordinatesWatch,
          timestamp: mockTimestamp,
          error: null,
          isLoading: false,
        });
      });
    });

    it("clears watch", () => {
      const mockCoordinatesInitial = {
        latitude: 12.3456789,
        longitude: 34.5678912,
      };
      mockGetCurrentPosition.mockImplementationOnce(
        successHandler({
          coords: mockCoordinatesInitial,
        })
      );

      const mockCoordinatesWatch = {
        latitude: 23.4567891,
        longitude: 45.6789123,
      };
      const mockTimestamp = 1659386826480;
      const mockWatchId = 987;
      mockWatchPosition.mockImplementationOnce(
        successHandler(
          {
            coords: mockCoordinatesWatch,
            timestamp: mockTimestamp,
          },
          mockWatchId
        )
      );

      renderHook(() => useGeolocation());

      requestAnimationFrame(() => {
        expect(mockClearWatch).toHaveBeenCalledWith(mockWatchId);
      });
    });

    it("does nothing if isEnabled is false", () => {
      const mockCoordinates = {
        latitude: 12.3456789,
        longitude: 34.5678912,
        altitude: null,
        accuracy: 12.345,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };
      mockGetCurrentPosition.mockImplementationOnce(
        successHandler({ coords: mockCoordinates })
      );

      const { result } = renderHook(() =>
        useGeolocation({}, mockCallback, false)
      );

      expect(result.current).toStrictEqual({
        latitude: null,
        longitude: null,
        altitude: null,
        accuracy: null,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
        timestamp: null,
        error: null,
        isLoading: false,
      });

      requestAnimationFrame(() => {
        expect(mockGetCurrentPosition).notToHaveBeenCalled();
        expect(mockWatchPosition).notToHaveBeenCalled();
        expect(mockCallback).notToHaveBeenCalled();
      });
    });
  });

  describe("when geolocation data is not available", () => {
    it("handles initial error", () => {
      const mockError = {
        code: 1,
        message: "User denied Geolocation",
      };
      mockGetCurrentPosition.mockImplementationOnce(errorHandler(mockError));

      const { result } = renderHook(() => useGeolocation());

      expect(result.current).toStrictEqual({
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: null,
        error: mockError,
        isLoading: false,
      });
    });

    it("handles error from watcher", () => {
      const mockCoordinates = {
        latitude: 12.3456789,
        longitude: 34.5678912,
        altitude: null,
        accuracy: 12.345,
        altitudeAccuracy: null,
        heading: null,
        speed: null,
      };
      mockGetCurrentPosition.mockImplementationOnce(
        successHandler({ coords: mockCoordinates })
      );

      const mockError = {
        code: 1,
        message: "User denied Geolocation",
      };
      mockWatchPosition.mockImplementationOnce(errorHandler(mockError));

      const { result } = renderHook(() => useGeolocation());

      expect(result.current).toStrictEqual({
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: null,
        error: mockError,
        isLoading: false,
      });
    });
  });

  describe("when geolocation is not supported", () => {
    beforeEach(() => {
      global.navigator.geolocation = undefined;
    });

    it("returns no data", () => {
      const { result } = renderHook(() => useGeolocation());

      expect(result.current).toStrictEqual({
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: null,
        error: new Error(
          "The acquisition of the geolocation information failed due to the lack of user agent support."
        ),
        isLoading: true,
      });
    });
  });
});
