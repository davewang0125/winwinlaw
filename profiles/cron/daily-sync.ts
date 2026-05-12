/**
 * Daily sync job for legal professional profiles
 *
 * This script:
 * 1. Runs all configured scrapers
 * 2. Updates database with new/changed profiles
 * 3. Marks inactive profiles
 * 4. Logs results
 */

import { ExampleScraper } from '../scrapers/example'
import { upsertProfessional, getScrapingStats } from '../database/operations'
import { query } from '../database/client'
import { logger } from '../utils/logger'

// Configuration
const SCRAPER_CONFIGS = [
  {
    name: 'Example',
    scraper: new ExampleScraper(),
    queries: ['litigation', 'mediation', 'arbitration'],
    maxPages: 10,
    enabled: false, // DISABLED - example only
  },
  // Add more scrapers here:
  // {
  //   name: 'FindLaw',
  //   scraper: new FindLawScraper(),
  //   queries: ['lawyer'],
  //   maxPages: 20,
  //   enabled: true,
  // },
]

/**
 * Run all scrapers
 */
async function runScrapers() {
  logger.info('=== Starting Daily Sync Job ===')

  const startTime = Date.now()
  let totalScraped = 0
  let totalAdded = 0
  let totalUpdated = 0
  let totalErrors = 0

  for (const config of SCRAPER_CONFIGS) {
    if (!config.enabled) {
      logger.info(`Skipping disabled scraper: ${config.name}`)
      continue
    }

    try {
      logger.info(`Running scraper: ${config.name}`)

      // Track seen profiles for this run
      const seenUrls = new Set<string>()

      for (const searchQuery of config.queries) {
        logger.info(`Searching for: ${searchQuery}`)

        // Run scraper
        const profiles = await config.scraper.scrape(
          searchQuery,
          config.maxPages
        )

        logger.info(
          `Found ${profiles.length} profiles for query: ${searchQuery}`
        )

        // Save profiles to database
        for (const profile of profiles) {
          seenUrls.add(profile.profileUrl)

          try {
            const id = await upsertProfessional(profile)

            // Check if it's new or updated
            const result = await query(
              'SELECT created_at, updated_at FROM legal_professionals WHERE id = $1',
              [id]
            )

            const isNew =
              result.rows[0].created_at.getTime() ===
              result.rows[0].updated_at.getTime()

            if (isNew) {
              totalAdded++
              logger.profileSaved(profile.fullName, id, 'inserted')
            } else {
              totalUpdated++
              logger.profileSaved(profile.fullName, id, 'updated')
            }

            totalScraped++
          } catch (error: any) {
            totalErrors++
            logger.error(`Failed to save profile: ${profile.fullName}`, {
              error: error.message,
            })
          }
        }
      }

      // Mark profiles not seen in this run as potentially inactive
      // (only if we successfully scraped)
      if (seenUrls.size > 0) {
        await markInactiveProfiles(config.name, seenUrls)
      }

      // Log stats for this scraper
      const stats = await getScrapingStats(config.scraper.getName())
      logger.info(`Stats for ${config.name}:`, stats)
    } catch (error: any) {
      logger.error(`Scraper ${config.name} failed:`, {
        error: error.message,
        stack: error.stack,
      })
      totalErrors++
    }
  }

  const duration = Date.now() - startTime

  logger.info('=== Daily Sync Job Completed ===', {
    duration: `${(duration / 1000).toFixed(2)}s`,
    totalScraped,
    totalAdded,
    totalUpdated,
    totalErrors,
  })

  return {
    totalScraped,
    totalAdded,
    totalUpdated,
    totalErrors,
    duration,
  }
}

/**
 * Mark profiles as inactive if not seen in recent scrape
 */
async function markInactiveProfiles(
  source: string,
  seenUrls: Set<string>
): Promise<number> {
  // Find profiles from this source that weren't seen in this run
  // and haven't been scraped in the last 7 days
  const result = await query(
    `
    UPDATE legal_professionals
    SET is_active = false
    WHERE source = $1
      AND is_active = true
      AND profile_url NOT IN (${Array.from(seenUrls).map((_, i) => `$${i + 2}`).join(', ')})
      AND last_scraped_at < NOW() - INTERVAL '7 days'
    RETURNING id
    `,
    [source, ...Array.from(seenUrls)]
  )

  const count = result.rowCount || 0

  if (count > 0) {
    logger.info(`Marked ${count} profiles as inactive for source: ${source}`)
  }

  return count
}

/**
 * Main execution
 */
async function main() {
  try {
    await runScrapers()
    process.exit(0)
  } catch (error) {
    logger.error('Daily sync job failed:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export { runScrapers, markInactiveProfiles }
