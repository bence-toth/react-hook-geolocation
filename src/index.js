import { useEffect, useState, useCallback } from "react";

const useGeolocation = (
  { enableHighAccuracy, maximumAge, timeout } = {},
  callback,
  isEnabled = true
) => {
  const [coordinates, setCoordinates] = useState({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null,
    isLoading: true,
  });

  const updateCoordinates = useCallback(
    ({ coords, timestamp }) => {
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
      } = coords;

      setCoordinates({
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp,
        error: null,
        isLoading: false,
      });

      if (typeof callback === "function") {
        callback({
          accuracy,
          altitude,
          altitudeAccuracy,
          heading,
          latitude,
          longitude,
          speed,
          timestamp,
          error: null,
          isLoading: false,
        });
      }
    },
    [callback]
  );

  const setError = useCallback((error) => {
    setCoordinates({
      accuracy: null,
      altitude: null,
      altitudeAccuracy: null,
      heading: null,
      latitude: null,
      longitude: null,
      speed: null,
      timestamp: null,
      error,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    let watchId;

    if (isEnabled && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateCoordinates, setError);
      watchId = navigator.geolocation.watchPosition(
        updateCoordinates,
        setError,
        {
          enableHighAccuracy,
          maximumAge,
          timeout,
        }
      );
    }

    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [
    isEnabled,
    callback,
    enableHighAccuracy,
    maximumAge,
    setError,
    timeout,
    updateCoordinates,
  ]);

  return coordinates;
};

export default useGeolocation;
