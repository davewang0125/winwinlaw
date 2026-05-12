import axios, { AxiosInstance } from 'axios'
import { checkRobots } from '../utils/robots'
import { RateLimiter, delay, randomDelay } from '../utils/rate-limit'
import { logger } from '../utils/logger'
import { LegalProfessional } from '../database/operations'

export interface ScraperConfig {
  source: string
  baseUrl: string
  userAgent: string
  rateLimiter: RateLimiter
  timeout: number
  maxRetries: number
  respectRobots: boolean
}

export abstract class BaseScraper {
  protected config: ScraperConfig
  protected axios: AxiosInstance

  constructor(config: Partial<ScraperConfig>) {
    this.config = {
      source: config.source || 'unknown',
      baseUrl: config.baseUrl || '',
      userAgent:
        config.userAgent || 'WinWinLaw Bot/1.0 (Educational Purpose)',
      rateLimiter:
        config.rateLimiter ||
        new RateLimiter({ requests: 10, perMilliseconds: 60000 }),
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      respectRobots: config.respectRobots !== false,
    }

    this.axios = axios.create({
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
      },
    })
  }

  /**
   * Check if URL is allowed by robots.txt
   */
  protected async isAllowed(url: string): Promise<boolean> {
    if (!this.config.respectRobots) return true

    const result = await checkRobots(url, this.config.userAgent)

    if (!result.allowed) {
      logger.warn(`URL blocked by robots.txt: ${url}`)
      return false
    }

    // Apply crawl delay if specified
    if (result.crawlDelay) {
      logger.debug(`Applying crawl delay: ${result.crawlDelay}s`)
      await delay(result.crawlDelay * 1000)
    }

    return true
  }

  /**
   * Fetch HTML content with rate limiting and retries
   */
  protected async fetchHtml(url: string): Promise<string | null> {
    // Check robots.txt
    if (!(await this.isAllowed(url))) {
      return null
    }

    // Rate limiting
    await this.config.rateLimiter.wait()

    // Fetch with retries
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        logger.debug(`Fetching ${url} (attempt ${attempt})`)

        const response = await this.axios.get(url)

        // Random delay between requests (be nice!)
        await randomDelay(1000, 3000)

        return response.data
      } catch (error: any) {
        logger.error(`Error fetching ${url} (attempt ${attempt})`, {
          error: error.message,
        })

        if (attempt < this.config.maxRetries) {
          // Exponential backoff
          const backoff = Math.pow(2, attempt) * 1000
          logger.debug(`Retrying after ${backoff}ms`)
          await delay(backoff)
        } else {
          logger.error(`Failed to fetch ${url} after ${attempt} attempts`)
          return null
        }
      }
    }

    return null
  }

  /**
   * Abstract methods - must be implemented by subclasses
   */
  abstract getSearchUrl(query: string, page: number): string
  abstract parseSearchResults(html: string): string[] // Returns profile URLs
  abstract parseProfile(html: string, url: string): LegalProfessional | null

  /**
   * Main scraping method
   */
  async scrape(
    query: string = '',
    maxPages: number = 10
  ): Promise<LegalProfessional[]> {
    logger.startSession(this.config.source)

    const profiles: LegalProfessional[] = []
    const seenUrls = new Set<string>()

    try {
      // Scrape search results
      for (let page = 1; page <= maxPages; page++) {
        logger.info(`Scraping ${this.config.source} page ${page}`)

        const searchUrl = this.getSearchUrl(query, page)
        const searchHtml = await this.fetchHtml(searchUrl)

        if (!searchHtml) {
          logger.warn(`Failed to fetch search page ${page}`)
          break
        }

        const profileUrls = this.parseSearchResults(searchHtml)

        if (profileUrls.length === 0) {
          logger.info(`No more results on page ${page}, stopping`)
          break
        }

        logger.info(`Found ${profileUrls.length} profiles on page ${page}`)

        // Scrape individual profiles
        for (const profileUrl of profileUrls) {
          // Skip if already seen
          if (seenUrls.has(profileUrl)) {
            logger.debug(`Skipping duplicate: ${profileUrl}`)
            continue
          }
          seenUrls.add(profileUrl)

          try {
            const profileHtml = await this.fetchHtml(profileUrl)

            if (!profileHtml) {
              logger.warn(`Failed to fetch profile: ${profileUrl}`)
              continue
            }

            const profile = this.parseProfile(profileHtml, profileUrl)

            if (profile) {
              profiles.push(profile)
              logger.profileScraped(profile.fullName, profileUrl)
            } else {
              logger.warn(`Failed to parse profile: ${profileUrl}`)
            }
          } catch (error: any) {
            logger.scrapingError(profileUrl, error)
          }
        }
      }

      logger.endSession(this.config.source, {
        totalProfiles: profiles.length,
        pagesScraped: Math.min(maxPages, profiles.length),
      })

      return profiles
    } catch (error: any) {
      logger.error(`Scraping session failed: ${error.message}`)
      throw error
    }
  }

  /**
   * Get scraper name
   */
  getName(): string {
    return this.config.source
  }
}

export default BaseScraper
