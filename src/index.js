import {useEffect, useState} from 'react'

const useGeolocation = ({enableHighAccuracy, maximumAge, timeout} = {}) => {

  const [coordinates, setCoordinates] = useState({
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: null,
    error: null
  })

  useEffect(() => {    
    const updateCoordinates = ({coords = {}, timestamp}) => {
      const {
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed
      } = coords
      setCoordinates({
        accuracy,
        altitude,
        altitudeAccuracy,
        heading,
        latitude,
        longitude,
        speed,
        timestamp,
        error: null
      })
    }
    
    const setError = error => {
      updateCoordinates({
        accuracy: null,
        altitude: null,
        altitudeAccuracy: null,
        heading: null,
        latitude: null,
        longitude: null,
        speed: null,
        timestamp: null,
        error
      })
    }

    let watchId
    if (navigator.geolocation && navigator.permissions) {
      navigator.geolocation.getCurrentPosition(updateCoordinates, setError)
      watchId = navigator.geolocation.watchPosition(
        updateCoordinates,
        setError,
        {enableHighAccuracy, maximumAge, timeout}
      )
    }
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId)
      }
    }
  }, [])
  
  return coordinates
}

export default useGeolocation

