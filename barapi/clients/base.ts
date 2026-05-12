import axios, { AxiosInstance } from 'axios'
import { RateLimiter } from '../utils/rate-limit'
import { cache } from '../utils/cache'
import { logger } from '../utils/logger'
import { LegalProfessional } from '../../profiles/database/operations'

export interface BarClientConfig {
  state: string
  stateName: string
  baseUrl: string
  apiKey?: string
  userAgent?: string
  rateLimiter: RateLimiter
  timeout: number
  maxRetries: number
  cacheEnabled: boolean
  cacheTTL: number
}

export interface SearchParams {
  name?: string
  barNumber?: string
  city?: string
  county?: string
  zipCode?: string
  practiceArea?: string
  status?: string
  limit?: number
  offset?: number
}

export abstract class BaseBarClient {
  protected config: BarClientConfig
  protected axios: AxiosInstance

  constructor(config: Partial<BarClientConfig>) {
    this.config = {
      state: config.state || 'unknown',
      stateName: config.stateName || 'Unknown',
      baseUrl: config.baseUrl || '',
      apiKey: config.apiKey,
      userAgent: config.userAgent || 'WinWinLaw/1.0 (Legal Directory)',
      rateLimiter:
        config.rateLimiter ||
        new RateLimiter({ requests: 100, perMilliseconds: 60000 }),
      timeout: config.timeout || 30000,
      maxRetries: config.maxRetries || 3,
      cacheEnabled: config.cacheEnabled !== false,
      cacheTTL: config.cacheTTL || 86400, // 24 hours
    }

    this.axios = axios.create({
      baseURL: this.config.baseUrl,
      timeout: this.config.timeout,
      headers: {
        'User-Agent': this.config.userAgent,
        ...(this.config.apiKey && {
          Authorization: `Bearer ${this.config.apiKey}`,
        }),
      },
    })
  }

  /**
   * Make API request with rate limiting, caching, and retries
   */
  protected async request<T>(
    endpoint: string,
    params?: any,
    method: 'GET' | 'POST' = 'GET'
  ): Promise<T | null> {
    // Generate cache key
    const cacheKey = `${this.config.state}:${endpoint}:${JSON.stringify(params)}`

    // Check cache
    if (this.config.cacheEnabled) {
      const cached = await cache.get<T>(cacheKey)
      if (cached) {
        logger.debug(`Cache hit: ${cacheKey}`)
        return cached
      }
    }

    // Rate limiting
    await this.config.rateLimiter.wait()

    // Make request with retries
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        logger.debug(
          `API request: ${method} ${endpoint} (attempt ${attempt})`,
          params
        )

        const response =
          method === 'GET'
            ? await this.axios.get(endpoint, { params })
            : await this.axios.post(endpoint, params)

        // Cache successful response
        if (this.config.cacheEnabled && response.data) {
          await cache.set(cacheKey, response.data, this.config.cacheTTL)
        }

        return response.data
      } catch (error: any) {
        logger.error(
          `API request failed: ${endpoint} (attempt ${attempt})`,
          {
            error: error.message,
            status: error.response?.status,
          }
        )

        // Don't retry on 4xx errors (client errors)
        if (error.response?.status >= 400 && error.response?.status < 500) {
          logger.error(`Client error, not retrying: ${error.response.status}`)
          return null
        }

        if (attempt < this.config.maxRetries) {
          // Exponential backoff
          const backoff = Math.pow(2, attempt) * 1000
          logger.debug(`Retrying after ${backoff}ms`)
          await new Promise((resolve) => setTimeout(resolve, backoff))
        } else {
          logger.error(`Failed after ${attempt} attempts`)
          return null
        }
      }
    }

    return null
  }

  /**
   * Abstract methods - must be implemented by state-specific clients
   */

  /**
   * Search attorneys by various criteria
   */
  abstract search(params: SearchParams): Promise<LegalProfessional[]>

  /**
   * Get attorney details by bar number
   */
  abstract getByBarNumber(barNumber: string): Promise<LegalProfessional | null>

  /**
   * Get all attorneys (paginated)
   */
  abstract getAll(
    limit?: number,
    offset?: number
  ): Promise<LegalProfessional[]>

  /**
   * Get attorney status (active, inactive, suspended, etc.)
   */
  abstract getStatus(barNumber: string): Promise<string | null>

  /**
   * Check if attorney has disciplinary actions
   */
  abstract getDisciplinaryHistory(
    barNumber: string
  ): Promise<any[] | null>

  /**
   * Get state name
   */
  getState(): string {
    return this.config.state
  }

  /**
   * Get state full name
   */
  getStateName(): string {
    return this.config.stateName
  }

  /**
   * Clear cache for this state
   */
  async clearCache(): Promise<void> {
    await cache.clear(`${this.config.state}:*`)
    logger.info(`Cache cleared for ${this.config.stateName}`)
  }

  /**
   * Get API stats
   */
  getStats() {
    return {
      state: this.config.stateName,
      rateLimitRemaining: this.config.rateLimiter.getCurrentCount(),
      cacheEnabled: this.config.cacheEnabled,
    }
  }
}

export default BaseBarClient
