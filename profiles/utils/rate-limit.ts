/**
 * Simple rate limiter for scraping
 */

interface RateLimitConfig {
  requests: number // Max requests
  perMilliseconds: number // Time window
}

class RateLimiter {
  private requests: number[]
  private maxRequests: number
  private timeWindow: number

  constructor(config: RateLimitConfig) {
    this.requests = []
    this.maxRequests = config.requests
    this.timeWindow = config.perMilliseconds
  }

  /**
   * Wait if necessary before making request
   */
  async wait(): Promise<void> {
    const now = Date.now()

    // Remove old requests outside time window
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    )

    // If at limit, wait
    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.timeWindow - (now - oldestRequest)

      if (waitTime > 0) {
        console.log(`Rate limit reached, waiting ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        return this.wait() // Recursive call after waiting
      }
    }

    // Record this request
    this.requests.push(now)
  }

  /**
   * Get current request count in window
   */
  getCurrentCount(): number {
    const now = Date.now()
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    )
    return this.requests.length
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.requests = []
  }
}

// Default rate limiters
export const defaultLimiter = new RateLimiter({
  requests: 10,
  perMilliseconds: 60000, // 10 requests per minute
})

export const conservativeLimiter = new RateLimiter({
  requests: 5,
  perMilliseconds: 60000, // 5 requests per minute
})

export const aggressiveLimiter = new RateLimiter({
  requests: 20,
  perMilliseconds: 60000, // 20 requests per minute
})

/**
 * Create custom rate limiter
 */
export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}

/**
 * Simple delay helper
 */
export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Random delay between min and max ms
 */
export async function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}

export { RateLimiter }
export type { RateLimitConfig }
