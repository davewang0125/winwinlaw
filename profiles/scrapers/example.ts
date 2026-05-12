/**
 * EXAMPLE SCRAPER - Template for building real scrapers
 *
 * ⚠️ IMPORTANT: This is a TEMPLATE ONLY
 * - Do NOT use without permission from website owner
 * - Check Terms of Service first
 * - Use official APIs when available
 * - This is for educational purposes
 */

import { BaseScraper } from './base'
import { LegalProfessional } from '../database/operations'
import * as cheerio from 'cheerio'
import { conservativeLimiter } from '../utils/rate-limit'

export class ExampleScraper extends BaseScraper {
  constructor() {
    super({
      source: 'example',
      baseUrl: 'https://example.com',
      userAgent: 'WinWinLaw Bot/1.0 (Educational Purpose; Contact: info@winwinlaw.com)',
      rateLimiter: conservativeLimiter, // Be conservative!
      respectRobots: true, // Always respect robots.txt
    })
  }

  /**
   * Build search URL for lawyers
   */
  getSearchUrl(query: string, page: number): string {
    // Example: search for lawyers by practice area or location
    const params = new URLSearchParams({
      q: query || 'lawyer',
      page: page.toString(),
      type: 'lawyer',
    })
    return `${this.config.baseUrl}/search?${params.toString()}`
  }

  /**
   * Parse search results page to get profile URLs
   */
  parseSearchResults(html: string): string[] {
    const $ = cheerio.load(html)
    const profileUrls: string[] = []

    // Example selector - adjust based on actual HTML structure
    $('.lawyer-result a.profile-link').each((i, el) => {
      const href = $(el).attr('href')
      if (href) {
        const fullUrl = href.startsWith('http')
          ? href
          : `${this.config.baseUrl}${href}`
        profileUrls.push(fullUrl)
      }
    })

    return profileUrls
  }

  /**
   * Parse individual lawyer profile page
   */
  parseProfile(html: string, url: string): LegalProfessional | null {
    try {
      const $ = cheerio.load(html)

      // Extract data - ADJUST SELECTORS BASED ON ACTUAL HTML
      const fullName = $('.lawyer-name').text().trim()
      if (!fullName) return null

      const [firstName, ...lastNameParts] = fullName.split(' ')
      const lastName = lastNameParts.join(' ')

      const email = $('a[href^="mailto:"]').attr('href')?.replace('mailto:', '')
      const phone = $('.phone-number').text().trim()

      const lawFirm = $('.firm-name').text().trim()
      const address = $('.address').text().trim()
      const city = $('.city').text().trim()
      const state = $('.state').text().trim()

      const bio = $('.biography').text().trim()

      // Extract practice areas
      const practiceAreas: string[] = []
      $('.practice-area').each((i, el) => {
        const area = $(el).text().trim()
        if (area) practiceAreas.push(area)
      })

      // Extract education
      const education = []
      $('.education-item').each((i, el) => {
        const institution = $(el).find('.school').text().trim()
        const degree = $(el).find('.degree').text().trim()
        const year = parseInt($(el).find('.year').text().trim(), 10)

        if (institution) {
          education.push({ institution, degree, graduationYear: year })
        }
      })

      // Extract bar admissions
      const barAdmissions = []
      $('.bar-admission').each((i, el) => {
        const jurisdiction = $(el).text().trim()
        if (jurisdiction) {
          barAdmissions.push({ jurisdiction })
        }
      })

      // Build profile object
      const profile: LegalProfessional = {
        firstName: firstName || '',
        lastName: lastName || '',
        fullName,
        email,
        phone,
        address,
        city,
        state,
        country: 'United States',
        lawFirm,
        bio,
        profileUrl: url,
        source: this.config.source,
        sourceId: this.extractSourceId(url),
        practiceAreas,
        education,
        barAdmissions,
        isActive: true,
        verified: false,
      }

      return profile
    } catch (error) {
      console.error('Error parsing profile:', error)
      return null
    }
  }

  /**
   * Extract unique ID from profile URL
   */
  private extractSourceId(url: string): string {
    // Example: extract ID from URL like /lawyer/12345-john-doe
    const match = url.match(/\/lawyer\/(\d+)/)
    return match ? match[1] : url
  }
}

/**
 * Usage example:
 *
 * const scraper = new ExampleScraper()
 *
 * // Search for personal injury lawyers in California
 * const profiles = await scraper.scrape('personal injury california', 5)
 *
 * // Save to database
 * for (const profile of profiles) {
 *   await upsertProfessional(profile)
 * }
 */
