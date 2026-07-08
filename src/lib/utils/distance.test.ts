import { describe, it, expect } from 'vitest'
import { calculateDistance, calculateDistanceFromRGU, RGU_LATITUDE, RGU_LONGITUDE } from './distance'

describe('Distance Utility tests', () => {
  it('should return 0 when comparing RGU to itself', () => {
    const dist = calculateDistanceFromRGU(RGU_LATITUDE, RGU_LONGITUDE)
    expect(dist).toBe(0)
  })

  it('should calculate non-zero distance correctly', () => {
    // 0.01 degree shift in longitude at 27N is approx 0.99 km
    const dist = calculateDistanceFromRGU(RGU_LATITUDE, RGU_LONGITUDE + 0.01)
    expect(dist).toBeGreaterThan(0.8)
    expect(dist).toBeLessThan(1.2)
  })

  it('should throw an error for invalid latitudes', () => {
    expect(() => calculateDistance(100, 45, RGU_LATITUDE, RGU_LONGITUDE)).toThrow()
    expect(() => calculateDistance(-95, 45, RGU_LATITUDE, RGU_LONGITUDE)).toThrow()
  })

  it('should throw an error for invalid longitudes', () => {
    expect(() => calculateDistance(25, 200, RGU_LATITUDE, RGU_LONGITUDE)).toThrow()
    expect(() => calculateDistance(25, -190, RGU_LATITUDE, RGU_LONGITUDE)).toThrow()
  })
})
