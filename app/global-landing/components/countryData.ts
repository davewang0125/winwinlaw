export interface Country {
  name: string
  lat: number
  lng: number
  professionals: number
  code: string
}

/**
 * Country data with legal professional counts
 * This data can be updated or fetched from an API
 */
export const countryData: Country[] = [
  { name: 'United States', lat: 37.0902, lng: -95.7129, professionals: 12453, code: 'US' },
  { name: 'United Kingdom', lat: 55.3781, lng: -3.4360, professionals: 8921, code: 'GB' },
  { name: 'Germany', lat: 51.1657, lng: 10.4515, professionals: 6234, code: 'DE' },
  { name: 'France', lat: 46.2276, lng: 2.2137, professionals: 5876, code: 'FR' },
  { name: 'Canada', lat: 56.1304, lng: -106.3468, professionals: 4532, code: 'CA' },
  { name: 'Australia', lat: -25.2744, lng: 133.7751, professionals: 3891, code: 'AU' },
  { name: 'Japan', lat: 36.2048, lng: 138.2529, professionals: 3456, code: 'JP' },
  { name: 'China', lat: 35.8617, lng: 104.1954, professionals: 2987, code: 'CN' },
  { name: 'India', lat: 20.5937, lng: 78.9629, professionals: 2654, code: 'IN' },
  { name: 'Brazil', lat: -14.2350, lng: -51.9253, professionals: 2341, code: 'BR' },
  { name: 'Netherlands', lat: 52.1326, lng: 5.2913, professionals: 2156, code: 'NL' },
  { name: 'Singapore', lat: 1.3521, lng: 103.8198, professionals: 1987, code: 'SG' },
  { name: 'Switzerland', lat: 46.8182, lng: 8.2275, professionals: 1876, code: 'CH' },
  { name: 'Spain', lat: 40.4637, lng: -3.7492, professionals: 1654, code: 'ES' },
  { name: 'Italy', lat: 41.8719, lng: 12.5674, professionals: 1543, code: 'IT' },
  { name: 'South Korea', lat: 35.9078, lng: 127.7669, professionals: 1432, code: 'KR' },
  { name: 'Mexico', lat: 23.6345, lng: -102.5528, professionals: 1298, code: 'MX' },
  { name: 'Sweden', lat: 60.1282, lng: 18.6435, professionals: 1187, code: 'SE' },
  { name: 'Belgium', lat: 50.5039, lng: 4.4699, professionals: 1076, code: 'BE' },
  { name: 'UAE', lat: 23.4241, lng: 53.8478, professionals: 987, code: 'AE' },
  { name: 'South Africa', lat: -30.5595, lng: 22.9375, professionals: 876, code: 'ZA' },
  { name: 'Argentina', lat: -38.4161, lng: -63.6167, professionals: 765, code: 'AR' },
  { name: 'Poland', lat: 51.9194, lng: 19.1451, professionals: 654, code: 'PL' },
  { name: 'Turkey', lat: 38.9637, lng: 35.2433, professionals: 598, code: 'TR' },
  { name: 'Russia', lat: 61.5240, lng: 105.3188, professionals: 543, code: 'RU' },
  { name: 'Norway', lat: 60.4720, lng: 8.4689, professionals: 487, code: 'NO' },
  { name: 'Denmark', lat: 56.2639, lng: 9.5018, professionals: 432, code: 'DK' },
  { name: 'Austria', lat: 47.5162, lng: 14.5501, professionals: 398, code: 'AT' },
  { name: 'Israel', lat: 31.0461, lng: 34.8516, professionals: 365, code: 'IL' },
  { name: 'Ireland', lat: 53.4129, lng: -8.2439, professionals: 321, code: 'IE' },
  { name: 'New Zealand', lat: -40.9006, lng: 174.8860, professionals: 298, code: 'NZ' },
  { name: 'Finland', lat: 61.9241, lng: 25.7482, professionals: 276, code: 'FI' },
  { name: 'Portugal', lat: 39.3999, lng: -8.2245, professionals: 243, code: 'PT' },
  { name: 'Greece', lat: 39.0742, lng: 21.8243, professionals: 218, code: 'GR' },
  { name: 'Czech Republic', lat: 49.8175, lng: 15.4730, professionals: 197, code: 'CZ' },
  { name: 'Romania', lat: 45.9432, lng: 24.9668, professionals: 176, code: 'RO' },
  { name: 'Hungary', lat: 47.1625, lng: 19.5033, professionals: 154, code: 'HU' },
  { name: 'Chile', lat: -35.6751, lng: -71.5430, professionals: 143, code: 'CL' },
  { name: 'Colombia', lat: 4.5709, lng: -74.2973, professionals: 132, code: 'CO' },
  { name: 'Thailand', lat: 15.8700, lng: 100.9925, professionals: 121, code: 'TH' },
  { name: 'Malaysia', lat: 4.2105, lng: 101.9758, professionals: 108, code: 'MY' },
  { name: 'Philippines', lat: 12.8797, lng: 121.7740, professionals: 98, code: 'PH' },
  { name: 'Indonesia', lat: -0.7893, lng: 113.9213, professionals: 87, code: 'ID' },
  { name: 'Vietnam', lat: 14.0583, lng: 108.2772, professionals: 76, code: 'VN' },
  { name: 'Egypt', lat: 26.8206, lng: 30.8025, professionals: 65, code: 'EG' },
  { name: 'Saudi Arabia', lat: 23.8859, lng: 45.0792, professionals: 54, code: 'SA' },
  { name: 'Nigeria', lat: 9.0820, lng: 8.6753, professionals: 43, code: 'NG' },
  { name: 'Kenya', lat: -0.0236, lng: 37.9062, professionals: 32, code: 'KE' },
  { name: 'Morocco', lat: 31.7917, lng: -7.0926, professionals: 28, code: 'MA' },
  { name: 'Pakistan', lat: 30.3753, lng: 69.3451, professionals: 21, code: 'PK' },
]

/**
 * Calculate total professionals across all countries
 */
export const getTotalProfessionals = (): number => {
  return countryData.reduce((sum, country) => sum + country.professionals, 0)
}

/**
 * Get countries sorted by professional count
 */
export const getTopCountries = (limit: number = 10): Country[] => {
  return [...countryData]
    .sort((a, b) => b.professionals - a.professionals)
    .slice(0, limit)
}

/**
 * Get country by code
 */
export const getCountryByCode = (code: string): Country | undefined => {
  return countryData.find(country => country.code === code)
}
