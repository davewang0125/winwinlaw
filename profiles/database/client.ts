import { Pool, QueryResult } from 'pg'

// Database client configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://localhost:5432/winwinlaw',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Handle pool errors
pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err)
  process.exit(-1)
})

// Query helper
export async function query(text: string, params?: any[]): Promise<QueryResult> {
  const start = Date.now()
  try {
    const res = await pool.query(text, params)
    const duration = Date.now() - start
    console.log('Executed query', { text, duration, rows: res.rowCount })
    return res
  } catch (error) {
    console.error('Query error', { text, error })
    throw error
  }
}

// Transaction helper
export async function transaction<T>(
  callback: (client: any) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}

// Health check
export async function healthCheck(): Promise<boolean> {
  try {
    await query('SELECT 1')
    return true
  } catch (error) {
    return false
  }
}

// Initialize database (run schema)
export async function initDatabase(): Promise<void> {
  const fs = require('fs')
  const path = require('path')

  try {
    const schemaPath = path.join(__dirname, 'schema.sql')
    const schema = fs.readFileSync(schemaPath, 'utf-8')

    await query(schema)
    console.log('✅ Database initialized successfully')
  } catch (error) {
    console.error('❌ Failed to initialize database:', error)
    throw error
  }
}

// Close pool
export async function closePool(): Promise<void> {
  await pool.end()
}

export default {
  query,
  transaction,
  healthCheck,
  initDatabase,
  closePool,
}
