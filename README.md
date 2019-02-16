# react-hook-geolocation

A React hook to access data from the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

## Usage

```jsx
import React from 'react'
import useGeolocation from 'react-hook-geolocation'

const ComponentWithGeolocation = () => {
  const geolocation = useGeolocation()

  return !geolocation.error
    ? (
      <ul>
        <li>Latitude:          {geolocation.latitude}</li>
        <li>Longitude:         {geolocation.longitude}</li>
        <li>Location accuracy: {geolocation.accuracy}</li>
        <li>Altitude:          {geolocation.altitude}</li>
        <li>Altitude accuracy: {geolocation.altitudeAccuracy}</li>
        <li>Heading:           {geolocation.heading}</li>
        <li>Speed:             {geolocation.speed}</li>
        <li>Timestamp:         {geolocation.timestamp}</li>
      </ul>
    )
    : (
      <p>No geolocation, sorry.</p>
    )
}
```

### Using `PositionOptions`

[There is a way](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API#Fine_tuning_response) to use `PositionOptions` to fine tune response coming from `watchPosition` of the Geolocation API.

If you want to use this feature, simply provide `useGeolocation` with a `PositionOptions` object:

```jsx
const geolocation = useGeolocation({
  enableHighAccuracy: true, 
  maximumAge:         15000, 
  timeout:            12000
})
```

## Notes

Accss to data from the Geolocation API needs user permission.

If permission to access geolocation was previously granted by the user, geolocation data will be available. If permission to access was not granted previously, the user will be prompted to give permission when the component mounts.

In permission was previously denied by the user, if the user agent does not support the Geolocation API or the Permission API, or if some other error occurs, the object returned from the hook will still contain all members, and values will be `null`. If you are lucky, `geolocation.error.message` and `geolocation.error.code` might contain something userful to help you determine what went wrong.

## Caveats

Geolocation API is available only in secure contexts (a.k.a. only using HTTPS).

Getting geolocation data can take time, especially with high accuracy enabled – getting a GPS fix can take up to a minute.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
