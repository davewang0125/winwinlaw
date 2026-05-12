/**
 * Database operations for State Bar API data
 * Reuses the same database schema from profiles/
 */

// Import from profiles database
export {
  upsertProfessional,
  searchProfessionals,
  getProfessionalById,
  deactivateProfessional,
  getScrapingStats,
  type LegalProfessional,
  type Education,
  type BarAdmission,
  type Language,
} from '../../profiles/database/operations'

import { query } from '../../profiles/database/client'

/**
 * Get stats specifically for State Bar API sources
 */
export async function getBarAPIStats(state: string) {
  const source = `${state.toLowerCase()}_state_bar`

  const result = await query(
    `
    SELECT
      COUNT(*) FILTER (WHERE DATE(last_scraped_at) = CURRENT_DATE) as synced_today,
      COUNT(*) FILTER (WHERE DATE(created_at) = CURRENT_DATE) as added_today,
      COUNT(*) FILTER (WHERE DATE(updated_at) = CURRENT_DATE AND DATE(created_at) != CURRENT_DATE) as updated_today,
      COUNT(*) as total_active,
      MAX(last_scraped_at) as last_sync,
      COUNT(*) FILTER (WHERE verified = true) as verified_count
    FROM legal_professionals
    WHERE source = $1 AND is_active = true
    `,
    [source]
  )

  return result.rows[0]
}

/**
 * Get attorneys by state
 */
export async function getAttorneysByState(
  state: string,
  limit: number = 100,
  offset: number = 0
) {
  const result = await query(
    `
    SELECT *
    FROM legal_professionals
    WHERE state = $1
      AND is_active = true
    ORDER BY last_name, first_name
    LIMIT $2 OFFSET $3
    `,
    [state, limit, offset]
  )

  return result.rows
}

/**
 * Get attorney by bar number
 */
export async function getAttorneyByBarNumber(barNumber: string) {
  const result = await query(
    `
    SELECT *
    FROM legal_professionals
    WHERE bar_number = $1
    LIMIT 1
    `,
    [barNumber]
  )

  return result.rows.length > 0 ? result.rows[0] : null
}

/**
 * Count attorneys by state
 */
export async function countAttorneysByState(state: string): Promise<number> {
  const result = await query(
    `
    SELECT COUNT(*) as count
    FROM legal_professionals
    WHERE state = $1 AND is_active = true
    `,
    [state]
  )

  return parseInt(result.rows[0].count, 10)
}

/**
 * Get attorneys needing update (not synced recently)
 */
export async function getStaleAttorneys(
  state: string,
  daysOld: number = 30,
  limit: number = 100
) {
  const result = await query(
    `
    SELECT bar_number, full_name, last_scraped_at
    FROM legal_professionals
    WHERE state = $1
      AND is_active = true
      AND last_scraped_at < NOW() - INTERVAL '${daysOld} days'
    ORDER BY last_scraped_at ASC
    LIMIT $2
    `,
    [state, limit]
  )

  return result.rows
}

/**
 * Mark attorneys as verified (from State Bar)
 */
export async function markAsVerified(barNumber: string): Promise<void> {
  await query(
    `
    UPDATE legal_professionals
    SET verified = true, updated_at = CURRENT_TIMESTAMP
    WHERE bar_number = $1
    `,
    [barNumber]
  )
}

/**
 * Bulk mark as verified
 */
export async function bulkMarkAsVerified(barNumbers: string[]): Promise<number> {
  const result = await query(
    `
    UPDATE legal_professionals
    SET verified = true, updated_at = CURRENT_TIMESTAMP
    WHERE bar_number = ANY($1)
    `,
    [barNumbers]
  )

  return result.rowCount || 0
}
