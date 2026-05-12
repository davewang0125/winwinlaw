/**
 * Simple file-based cache for API responses
 * Reduces API calls and improves performance
 */

import * as fs from 'fs'
import * as path from 'path'
import * as crypto from 'crypto'

class Cache {
  private cacheDir: string
  private enabled: boolean

  constructor(cacheDir: string = './cache', enabled: boolean = true) {
    this.cacheDir = path.resolve(cacheDir)
    this.enabled = enabled

    // Create cache directory if it doesn't exist
    if (this.enabled && !fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true })
    }
  }

  /**
   * Generate cache key hash
   */
  private hashKey(key: string): string {
    return crypto.createHash('md5').update(key).digest('hex')
  }

  /**
   * Get cache file path
   */
  private getFilePath(key: string): string {
    const hash = this.hashKey(key)
    return path.join(this.cacheDir, `${hash}.json`)
  }

  /**
   * Get cached value
   */
  async get<T>(key: string): Promise<T | null> {
    if (!this.enabled) return null

    try {
      const filePath = this.getFilePath(key)

      if (!fs.existsSync(filePath)) {
        return null
      }

      const content = fs.readFileSync(filePath, 'utf-8')
      const cached = JSON.parse(content)

      // Check if expired
      if (cached.expiresAt && Date.now() > cached.expiresAt) {
        // Delete expired cache
        fs.unlinkSync(filePath)
        return null
      }

      return cached.data as T
    } catch (error) {
      console.error('Cache get error:', error)
      return null
    }
  }

  /**
   * Set cached value
   */
  async set(key: string, value: any, ttl: number = 86400): Promise<void> {
    if (!this.enabled) return

    try {
      const filePath = this.getFilePath(key)

      const cached = {
        key,
        data: value,
        cachedAt: Date.now(),
        expiresAt: Date.now() + ttl * 1000,
      }

      fs.writeFileSync(filePath, JSON.stringify(cached, null, 2))
    } catch (error) {
      console.error('Cache set error:', error)
    }
  }

  /**
   * Delete cached value
   */
  async delete(key: string): Promise<void> {
    if (!this.enabled) return

    try {
      const filePath = this.getFilePath(key)

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    } catch (error) {
      console.error('Cache delete error:', error)
    }
  }

  /**
   * Clear cache by pattern
   */
  async clear(pattern?: string): Promise<number> {
    if (!this.enabled) return 0

    try {
      const files = fs.readdirSync(this.cacheDir)
      let cleared = 0

      for (const file of files) {
        if (!file.endsWith('.json')) continue

        const filePath = path.join(this.cacheDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const cached = JSON.parse(content)

        // Check if matches pattern
        if (!pattern || cached.key.includes(pattern)) {
          fs.unlinkSync(filePath)
          cleared++
        }
      }

      return cleared
    } catch (error) {
      console.error('Cache clear error:', error)
      return 0
    }
  }

  /**
   * Get cache stats
   */
  getStats() {
    if (!this.enabled) {
      return { enabled: false, count: 0, size: 0 }
    }

    try {
      const files = fs.readdirSync(this.cacheDir)
      const jsonFiles = files.filter((f) => f.endsWith('.json'))

      let totalSize = 0
      for (const file of jsonFiles) {
        const filePath = path.join(this.cacheDir, file)
        const stats = fs.statSync(filePath)
        totalSize += stats.size
      }

      return {
        enabled: true,
        count: jsonFiles.length,
        size: totalSize,
        sizeFormatted: this.formatBytes(totalSize),
      }
    } catch (error) {
      return { enabled: true, count: 0, size: 0, error: 'Unable to read cache' }
    }
  }

  /**
   * Format bytes
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  /**
   * Clean expired entries
   */
  async cleanExpired(): Promise<number> {
    if (!this.enabled) return 0

    try {
      const files = fs.readdirSync(this.cacheDir)
      let cleaned = 0

      for (const file of files) {
        if (!file.endsWith('.json')) continue

        const filePath = path.join(this.cacheDir, file)
        const content = fs.readFileSync(filePath, 'utf-8')
        const cached = JSON.parse(content)

        // Check if expired
        if (cached.expiresAt && Date.now() > cached.expiresAt) {
          fs.unlinkSync(filePath)
          cleaned++
        }
      }

      return cleaned
    } catch (error) {
      console.error('Cache clean error:', error)
      return 0
    }
  }
}

// Export singleton instance
export const cache = new Cache(
  path.join(process.cwd(), 'barapi', 'cache'),
  process.env.CACHE_ENABLED !== 'false'
)

export default cache
