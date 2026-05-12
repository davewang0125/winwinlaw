import axios from 'axios'

interface RobotsResult {
  allowed: boolean
  crawlDelay?: number
}

// Cache robots.txt rules
const robotsCache = new Map<string, any>()

/**
 * Check if URL is allowed by robots.txt
 */
export async function checkRobots(
  url: string,
  userAgent: string = 'WinWinLawBot'
): Promise<RobotsResult> {
  try {
    const urlObj = new URL(url)
    const baseUrl = `${urlObj.protocol}//${urlObj.host}`
    const robotsUrl = `${baseUrl}/robots.txt`

    // Check cache
    if (!robotsCache.has(baseUrl)) {
      try {
        const response = await axios.get(robotsUrl, { timeout: 5000 })
        robotsCache.set(baseUrl, parseRobotsTxt(response.data))
      } catch (error) {
        // If robots.txt doesn't exist, assume allowed
        console.warn(`No robots.txt found for ${baseUrl}, assuming allowed`)
        robotsCache.set(baseUrl, { allowed: true })
      }
    }

    const rules = robotsCache.get(baseUrl)
    const path = urlObj.pathname + urlObj.search

    return checkPath(rules, path, userAgent)
  } catch (error) {
    console.error('Error checking robots.txt:', error)
    // Default to allowed if check fails
    return { allowed: true }
  }
}

/**
 * Parse robots.txt content
 */
function parseRobotsTxt(content: string): any {
  const lines = content.split('\n')
  const rules: any = {
    '*': { disallow: [], allow: [], crawlDelay: null },
  }
  let currentAgent = '*'

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue

    const [key, value] = trimmed.split(':').map((s) => s.trim())

    if (key.toLowerCase() === 'user-agent') {
      currentAgent = value
      if (!rules[currentAgent]) {
        rules[currentAgent] = { disallow: [], allow: [], crawlDelay: null }
      }
    } else if (key.toLowerCase() === 'disallow') {
      rules[currentAgent].disallow.push(value)
    } else if (key.toLowerCase() === 'allow') {
      rules[currentAgent].allow.push(value)
    } else if (key.toLowerCase() === 'crawl-delay') {
      rules[currentAgent].crawlDelay = parseInt(value, 10)
    }
  }

  return rules
}

/**
 * Check if path is allowed for user agent
 */
function checkPath(
  rules: any,
  path: string,
  userAgent: string
): RobotsResult {
  const agentRules = rules[userAgent] || rules['*']

  // Check disallow rules
  for (const pattern of agentRules.disallow) {
    if (pattern && matchesPattern(path, pattern)) {
      // Check if explicitly allowed
      for (const allowPattern of agentRules.allow) {
        if (allowPattern && matchesPattern(path, allowPattern)) {
          return {
            allowed: true,
            crawlDelay: agentRules.crawlDelay,
          }
        }
      }
      return { allowed: false }
    }
  }

  return {
    allowed: true,
    crawlDelay: agentRules.crawlDelay,
  }
}

/**
 * Match path against robots.txt pattern
 */
function matchesPattern(path: string, pattern: string): boolean {
  if (pattern === '/') return true
  if (pattern === '') return true

  // Convert robots.txt wildcard to regex
  const regexPattern = pattern
    .replace(/\*/g, '.*')
    .replace(/\$/g, '\\$')
    .replace(/\./g, '\\.')

  const regex = new RegExp(`^${regexPattern}`)
  return regex.test(path)
}

/**
 * Clear robots.txt cache
 */
export function clearRobotsCache(): void {
  robotsCache.clear()
}
