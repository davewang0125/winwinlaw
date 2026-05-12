/**
 * California State Bar API Client
 *
 * Official State Bar of California attorney database
 * API: https://apps.calbar.ca.gov/api/
 * Public Search: https://apps.calbar.ca.gov/attorney/Licensee/
 *
 * This uses publicly available data from the California State Bar
 */

import { BaseBarClient, SearchParams } from './base'
import { LegalProfessional } from '../../profiles/database/operations'
import { conservativeLimiter } from '../utils/rate-limit'
import { logger } from '../utils/logger'

export class CaliforniaBarClient extends BaseBarClient {
  constructor() {
    super({
      state: 'CA',
      stateName: 'California',
      baseUrl: 'https://apps.calbar.ca.gov/api',
      rateLimiter: conservativeLimiter, // Be respectful
      cacheEnabled: true,
      cacheTTL: 86400, // 24 hours
    })
  }

  /**
   * Search California attorneys
   */
  async search(params: SearchParams): Promise<LegalProfessional[]> {
    logger.info('Searching California State Bar', params)

    const profiles: LegalProfessional[] = []

    // If bar number provided, use direct lookup
    if (params.barNumber) {
      const profile = await this.getByBarNumber(params.barNumber)
      return profile ? [profile] : []
    }

    // Otherwise, search by name/location
    const searchParams: any = {
      limit: params.limit || 50,
      offset: params.offset || 0,
    }

    if (params.name) searchParams.name = params.name
    if (params.city) searchParams.city = params.city
    if (params.zipCode) searchParams.zipCode = params.zipCode
    if (params.status) searchParams.status = params.status

    try {
      // Note: Actual API endpoints may vary
      // This is a template - adjust based on real API documentation
      const response = await this.request<any>(
        '/members/search',
        searchParams
      )

      if (!response || !response.attorneys) {
        logger.warn('No results from California State Bar API')
        return []
      }

      for (const attorney of response.attorneys) {
        const profile = this.parseAttorney(attorney)
        if (profile) {
          profiles.push(profile)
        }
      }

      logger.info(`Found ${profiles.length} California attorneys`)
      return profiles
    } catch (error) {
      logger.error('Error searching California State Bar', error)
      return []
    }
  }

  /**
   * Get attorney by bar number (most reliable method)
   */
  async getByBarNumber(barNumber: string): Promise<LegalProfessional | null> {
    try {
      logger.debug(`Fetching CA attorney: ${barNumber}`)

      // California State Bar API endpoint
      const response = await this.request<any>(
        `/members/${barNumber}`
      )

      if (!response) {
        logger.warn(`Attorney not found: ${barNumber}`)
        return null
      }

      return this.parseAttorney(response)
    } catch (error) {
      logger.error(`Error fetching attorney ${barNumber}`, error)
      return null
    }
  }

  /**
   * Get all attorneys (paginated)
   * Warning: This can be a large dataset
   */
  async getAll(
    limit: number = 100,
    offset: number = 0
  ): Promise<LegalProfessional[]> {
    logger.info(`Fetching CA attorneys (limit: ${limit}, offset: ${offset})`)

    return this.search({ limit, offset })
  }

  /**
   * Get attorney status
   */
  async getStatus(barNumber: string): Promise<string | null> {
    try {
      const response = await this.request<any>(
        `/members/${barNumber}/status`
      )

      return response?.status || null
    } catch (error) {
      logger.error(`Error fetching status for ${barNumber}`, error)
      return null
    }
  }

  /**
   * Get disciplinary history
   */
  async getDisciplinaryHistory(barNumber: string): Promise<any[] | null> {
    try {
      const response = await this.request<any>(
        `/members/${barNumber}/discipline`
      )

      return response?.actions || []
    } catch (error) {
      logger.error(`Error fetching discipline for ${barNumber}`, error)
      return null
    }
  }

  /**
   * Search by city
   */
  async searchByCity(
    city: string,
    limit: number = 50
  ): Promise<LegalProfessional[]> {
    return this.search({ city, limit })
  }

  /**
   * Search by practice area
   */
  async searchByPracticeArea(
    practiceArea: string,
    limit: number = 50
  ): Promise<LegalProfessional[]> {
    return this.search({ practiceArea, limit })
  }

  /**
   * Get active attorneys only
   */
  async getActiveAttorneys(
    limit: number = 100
  ): Promise<LegalProfessional[]> {
    return this.search({ status: 'Active', limit })
  }

  /**
   * Parse attorney data from API response
   */
  private parseAttorney(data: any): LegalProfessional | null {
    try {
      // Extract name
      const fullName = [
        data.firstName,
        data.middleName,
        data.lastName,
        data.suffix,
      ]
        .filter(Boolean)
        .join(' ')

      if (!fullName) {
        logger.warn('Attorney has no name, skipping')
        return null
      }

      // Parse address
      const address = data.address
        ? [
            data.address.street1,
            data.address.street2,
            data.address.street3,
          ]
            .filter(Boolean)
            .join(', ')
        : undefined

      // Parse practice areas
      const practiceAreas = data.practiceAreas
        ? data.practiceAreas.map((area: any) => area.name || area)
        : []

      // Parse education
      const education = data.lawSchools
        ? data.lawSchools.map((school: any) => ({
            institution: school.name,
            degree: school.degree || 'J.D.',
            graduationYear: school.year,
          }))
        : []

      // Parse bar admissions
      const barAdmissions = [
        {
          jurisdiction: 'California',
          admissionDate: data.admissionDate
            ? new Date(data.admissionDate)
            : undefined,
          barNumber: data.barNumber,
          status: data.status || 'Active',
        },
      ]

      // Build profile
      const profile: LegalProfessional = {
        firstName: data.firstName,
        lastName: data.lastName,
        fullName,
        email: data.email,
        phone: data.phone,
        address,
        city: data.address?.city,
        state: 'California',
        country: 'United States',
        postalCode: data.address?.zipCode,
        barNumber: data.barNumber,
        lawFirm: data.firmName,
        position: data.position,
        yearsExperience: data.admissionDate
          ? new Date().getFullYear() -
            new Date(data.admissionDate).getFullYear()
          : undefined,
        bio: data.biography,
        profileImageUrl: data.photoUrl,
        profileUrl: `https://apps.calbar.ca.gov/attorney/Licensee/${data.barNumber}`,
        source: 'california_state_bar',
        sourceId: data.barNumber,
        isActive: data.status === 'Active',
        verified: true, // State Bar data is verified
        practiceAreas,
        education,
        barAdmissions,
      }

      return profile
    } catch (error) {
      logger.error('Error parsing attorney data', { error, data })
      return null
    }
  }

  /**
   * Bulk import by location
   */
  async bulkImportByCity(city: string): Promise<number> {
    logger.info(`Bulk importing attorneys from ${city}, CA`)

    let total = 0
    let offset = 0
    const limit = 100

    while (true) {
      const attorneys = await this.search({ city, limit, offset })

      if (attorneys.length === 0) {
        break
      }

      // Save to database
      const { upsertProfessional } = require('../database/operations')

      for (const attorney of attorneys) {
        try {
          await upsertProfessional(attorney)
          total++
          logger.info(`Saved: ${attorney.fullName} (${attorney.barNumber})`)
        } catch (error) {
          logger.error(`Failed to save ${attorney.fullName}`, error)
        }
      }

      // If we got fewer results than limit, we're done
      if (attorneys.length < limit) {
        break
      }

      offset += limit
    }

    logger.info(`Bulk import complete: ${total} attorneys from ${city}`)
    return total
  }
}

/**
 * Usage Example:
 *
 * const client = new CaliforniaBarClient()
 *
 * // Search by bar number
 * const attorney = await client.getByBarNumber('123456')
 *
 * // Search by city
 * const attorneys = await client.searchByCity('Los Angeles', 50)
 *
 * // Bulk import
 * const count = await client.bulkImportByCity('San Francisco')
 */

export default CaliforniaBarClient
