declare module "react-hook-geolocation" {
  export interface EnrichedGeolocationCoordinates
    extends GeolocationCoordinates {
    timestamp: GeolocationPosition["timestamp"] | null;
    error: GeolocationPositionError | null;
    isLoading: boolean;
  }

  export default function useGeolocation(
    positionOptions?: PositionOptions,
    callback?: (geolocation: EnrichedGeolocationCoordinates) => void,
    isEnabled?: boolean
  ): EnrichedGeolocationCoordinates;
}
