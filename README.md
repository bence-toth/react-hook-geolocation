# react-hook-geolocation :earth_africa:

A React hook to access data from the [Geolocation API](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API).

## Installation

Using `npm`:

```sh
npm install --save react-hook-geolocation
```

Using `yarn`:

```sh
yarn add react-hook-geolocation
```

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

### Using a callback function

You can supply a second parameter to `useGeolocation` which will be called every time the data from the Geolocation API is updated. This callback function is then called with the `geolocation` object with all its properties.

If you don't use `PositionOptions`, I recommend that you supply `{}` as your first argument.

```jsx
const onGeolocationUpdate = geolocation => {
  console.log('Here’s some new data from the Geolocation API: ', geolocation)
}

const geolocation = useGeolocation({}, onGeolocationUpdate)
```

## Notes

Access to data from the Geolocation API needs user permission.

If permission to access geolocation was previously granted by the user, geolocation data will be available. If permission to access was not granted previously, the user will be prompted to give permission when the component mounts.

In permission was previously denied by the user, if the user agent does not support the Geolocation API, or if some other error occurs, the object returned from the hook will still contain all members, and values will be `null`. If you are lucky, `geolocation.error.message` and `geolocation.error.code` might contain something useful to help you determine what went wrong.

## Caveats

Geolocation API is available only in secure contexts (a.k.a. only using HTTPS).

Getting geolocation data can take time, especially with high accuracy enabled – getting a GPS fix can take up to a minute.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## Licence

LGPL-3.0
