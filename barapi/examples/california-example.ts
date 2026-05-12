/**
 * California State Bar API - Usage Examples
 *
 * This demonstrates how to use the California State Bar API client
 * to fetch and save attorney data to the database.
 */

import { CaliforniaBarClient } from '../clients/california'
import {
  upsertProfessional,
  getBarAPIStats,
  countAttorneysByState,
} from '../database/operations'
import { logger } from '../utils/logger'

/**
 * Example 1: Fetch attorney by bar number
 */
async function example1_fetchByBarNumber() {
  console.log('\n=== Example 1: Fetch by Bar Number ===\n')

  const client = new CaliforniaBarClient()

  // Example bar number (use a real one)
  const barNumber = '123456'

  const attorney = await client.getByBarNumber(barNumber)

  if (attorney) {
    console.log('Attorney found:')
    console.log(`  Name: ${attorney.fullName}`)
    console.log(`  Bar #: ${attorney.barNumber}`)
    console.log(`  Firm: ${attorney.lawFirm}`)
    console.log(`  City: ${attorney.city}`)
    console.log(`  Status: ${attorney.isActive ? 'Active' : 'Inactive'}`)
    console.log(`  Practice Areas: ${attorney.practiceAreas?.join(', ')}`)

    // Save to database
    const id = await upsertProfessional(attorney)
    console.log(`\nSaved to database with ID: ${id}`)
  } else {
    console.log('Attorney not found')
  }
}

/**
 * Example 2: Search attorneys by city
 */
async function example2_searchByCity() {
  console.log('\n=== Example 2: Search by City ===\n')

  const client = new CaliforniaBarClient()

  // Search for attorneys in Los Angeles
  const attorneys = await client.searchByCity('Los Angeles', 10)

  console.log(`Found ${attorneys.length} attorneys in Los Angeles:\n`)

  for (const attorney of attorneys) {
    console.log(`${attorney.fullName} (Bar #${attorney.barNumber})`)
    console.log(`  ${attorney.lawFirm || 'Solo Practitioner'}`)
    console.log(`  ${attorney.address}`)
    console.log()
  }

  // Save all to database
  let saved = 0
  for (const attorney of attorneys) {
    try {
      await upsertProfessional(attorney)
      saved++
    } catch (error) {
      console.error(`Failed to save ${attorney.fullName}:`, error)
    }
  }

  console.log(`Saved ${saved}/${attorneys.length} attorneys to database`)
}

/**
 * Example 3: Search by practice area
 */
async function example3_searchByPracticeArea() {
  console.log('\n=== Example 3: Search by Practice Area ===\n')

  const client = new CaliforniaBarClient()

  // Search for criminal defense attorneys
  const attorneys = await client.searchByPracticeArea('Criminal Defense', 10)

  console.log(`Found ${attorneys.length} Criminal Defense attorneys:\n`)

  for (const attorney of attorneys) {
    console.log(`${attorney.fullName}`)
    console.log(`  Location: ${attorney.city}, CA`)
    console.log(`  Practice Areas: ${attorney.practiceAreas?.join(', ')}`)
    console.log()
  }
}

/**
 * Example 4: Get active attorneys
 */
async function example4_getActiveAttorneys() {
  console.log('\n=== Example 4: Get Active Attorneys ===\n')

  const client = new CaliforniaBarClient()

  // Get first 20 active attorneys
  const attorneys = await client.getActiveAttorneys(20)

  console.log(`Found ${attorneys.length} active attorneys:\n`)

  for (const attorney of attorneys) {
    console.log(`${attorney.fullName} - ${attorney.city}, CA`)
  }
}

/**
 * Example 5: Check attorney status and discipline
 */
async function example5_checkStatusAndDiscipline() {
  console.log('\n=== Example 5: Check Status & Discipline ===\n')

  const client = new CaliforniaBarClient()

  const barNumber = '123456'

  // Get status
  const status = await client.getStatus(barNumber)
  console.log(`Status: ${status}`)

  // Get disciplinary history
  const discipline = await client.getDisciplinaryHistory(barNumber)
  if (discipline && discipline.length > 0) {
    console.log(`\nDisciplinary actions: ${discipline.length}`)
    for (const action of discipline) {
      console.log(`  - ${action.type}: ${action.description}`)
    }
  } else {
    console.log('\nNo disciplinary actions found')
  }
}

/**
 * Example 6: Bulk import by city
 */
async function example6_bulkImport() {
  console.log('\n=== Example 6: Bulk Import ===\n')

  const client = new CaliforniaBarClient()

  // Import all attorneys from San Francisco
  console.log('Starting bulk import for San Francisco...')
  const count = await client.bulkImportByCity('San Francisco')

  console.log(`\nBulk import complete!`)
  console.log(`Total attorneys imported: ${count}`)
}

/**
 * Example 7: View statistics
 */
async function example7_viewStats() {
  console.log('\n=== Example 7: View Statistics ===\n')

  // Get California statistics
  const stats = await getBarAPIStats('CA')

  console.log('California State Bar API Statistics:')
  console.log(`  Total Active: ${stats.total_active}`)
  console.log(`  Verified: ${stats.verified_count}`)
  console.log(`  Added Today: ${stats.added_today}`)
  console.log(`  Updated Today: ${stats.updated_today}`)
  console.log(`  Synced Today: ${stats.synced_today}`)
  console.log(`  Last Sync: ${stats.last_sync}`)

  // Count by state
  const count = await countAttorneysByState('California')
  console.log(`\nTotal California attorneys in database: ${count}`)
}

/**
 * Example 8: Incremental update
 */
async function example8_incrementalUpdate() {
  console.log('\n=== Example 8: Incremental Update ===\n')

  const client = new CaliforniaBarClient()

  // Get attorneys that haven't been updated in 30 days
  const { getStaleAttorneys } = require('../database/operations')
  const staleAttorneys = await getStaleAttorneys('California', 30, 10)

  console.log(`Found ${staleAttorneys.length} attorneys needing update:\n`)

  for (const stale of staleAttorneys) {
    console.log(
      `${stale.full_name} (Bar #${stale.bar_number}) - Last sync: ${stale.last_scraped_at}`
    )

    // Fetch latest data
    const updated = await client.getByBarNumber(stale.bar_number)
    if (updated) {
      await upsertProfessional(updated)
      console.log('  ✓ Updated')
    }
  }
}

/**
 * Main - Run all examples
 */
async function main() {
  try {
    console.log('='.repeat(60))
    console.log('California State Bar API - Usage Examples')
    console.log('='.repeat(60))

    // Run examples (comment out ones you don't want to run)

    // await example1_fetchByBarNumber()
    // await example2_searchByCity()
    // await example3_searchByPracticeArea()
    // await example4_getActiveAttorneys()
    // await example5_checkStatusAndDiscipline()
    // await example6_bulkImport()  // Warning: This can take a while!
    await example7_viewStats()
    // await example8_incrementalUpdate()

    console.log('\n' + '='.repeat(60))
    console.log('Examples complete!')
    console.log('='.repeat(60) + '\n')
  } catch (error) {
    console.error('Error running examples:', error)
    process.exit(1)
  }
}

// Run if executed directly
if (require.main === module) {
  main()
}

export {
  example1_fetchByBarNumber,
  example2_searchByCity,
  example3_searchByPracticeArea,
  example4_getActiveAttorneys,
  example5_checkStatusAndDiscipline,
  example6_bulkImport,
  example7_viewStats,
  example8_incrementalUpdate,
}
