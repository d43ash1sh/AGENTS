// RGU Coordinates (Rajiv Gandhi University, Doimukh, Arunachal Pradesh)
export const RGU_LATITUDE = 27.1512
export const RGU_LONGITUDE = 93.7618

/**
 * Calculates the geodesic distance between two points on the Earth's surface using the Haversine formula.
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Geodesic distance in kilometers rounded to two decimal places
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (
    isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2) ||
    lat1 < -90 || lat1 > 90 ||
    lat2 < -90 || lat2 > 90 ||
    lon1 < -180 || lon1 > 180 ||
    lon2 < -180 || lon2 > 180
  ) {
    throw new Error('Invalid coordinate inputs')
  }

  const R = 6371 // Earth's mean radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c

  // Return distance rounded to 2 decimal places
  return Math.round((d + Number.EPSILON) * 100) / 100
}

/**
 * Convenience helper to calculate the distance from a coordinate point to RGU.
 * @param lat Latitude of the target location
 * @param lon Longitude of the target location
 * @returns Distance to RGU in kilometers rounded to two decimal places
 */
export function calculateDistanceFromRGU(lat: number, lon: number): number {
  return calculateDistance(lat, lon, RGU_LATITUDE, RGU_LONGITUDE)
}
