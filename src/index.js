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
    error:
      navigator.geolocation !== undefined
        ? null
        : new Error(
            "The acquisition of the geolocation information failed due to the lack of user agent support."
          ),
    isLoading: navigator.geolocation !== undefined && isEnabled,
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
    if (isEnabled === true) {
      setCoordinates((previousCoordinates) => ({
        ...previousCoordinates,
        isLoading: true,
      }));
    }
  }, [isEnabled]);

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
