/**
 * Rate limiter for API calls
 * Copy from profiles/utils/rate-limit.ts with adjustments
 */

interface RateLimitConfig {
  requests: number
  perMilliseconds: number
}

export class RateLimiter {
  private requests: number[]
  private maxRequests: number
  private timeWindow: number

  constructor(config: RateLimitConfig) {
    this.requests = []
    this.maxRequests = config.requests
    this.timeWindow = config.perMilliseconds
  }

  async wait(): Promise<void> {
    const now = Date.now()
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    )

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0]
      const waitTime = this.timeWindow - (now - oldestRequest)

      if (waitTime > 0) {
        console.log(`Rate limit reached, waiting ${waitTime}ms`)
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        return this.wait()
      }
    }

    this.requests.push(now)
  }

  getCurrentCount(): number {
    const now = Date.now()
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    )
    return this.requests.length
  }

  reset(): void {
    this.requests = []
  }
}

// Pre-configured rate limiters for State Bar APIs
export const conservativeLimiter = new RateLimiter({
  requests: 50,
  perMilliseconds: 60000, // 50 requests per minute
})

export const moderateLimiter = new RateLimiter({
  requests: 100,
  perMilliseconds: 60000, // 100 requests per minute
})

export const aggressiveLimiter = new RateLimiter({
  requests: 200,
  perMilliseconds: 60000, // 200 requests per minute
})

export function createRateLimiter(config: RateLimitConfig): RateLimiter {
  return new RateLimiter(config)
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function randomDelay(min: number, max: number): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min
  return delay(ms)
}

export type { RateLimitConfig }
