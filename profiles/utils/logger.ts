import * as fs from 'fs'
import * as path from 'path'

type LogLevel = 'info' | 'warn' | 'error' | 'debug'

class Logger {
  private logDir: string
  private logFile: string

  constructor(logDir: string = './logs') {
    this.logDir = logDir
    this.logFile = path.join(
      logDir,
      `scraper-${new Date().toISOString().split('T')[0]}.log`
    )

    // Create log directory if it doesn't exist
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true })
    }
  }

  private formatMessage(level: LogLevel, message: string, meta?: any): string {
    const timestamp = new Date().toISOString()
    const metaStr = meta ? ` | ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}\n`
  }

  private write(level: LogLevel, message: string, meta?: any): void {
    const formatted = this.formatMessage(level, message, meta)

    // Console output
    if (level === 'error') {
      console.error(formatted)
    } else if (level === 'warn') {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }

    // File output
    fs.appendFileSync(this.logFile, formatted)
  }

  info(message: string, meta?: any): void {
    this.write('info', message, meta)
  }

  warn(message: string, meta?: any): void {
    this.write('warn', message, meta)
  }

  error(message: string, meta?: any): void {
    this.write('error', message, meta)
  }

  debug(message: string, meta?: any): void {
    if (process.env.DEBUG) {
      this.write('debug', message, meta)
    }
  }

  // Log scraping session start
  startSession(source: string): void {
    this.info(`Starting scraping session for ${source}`)
  }

  // Log scraping session end
  endSession(source: string, stats: any): void {
    this.info(`Completed scraping session for ${source}`, stats)
  }

  // Log profile scraped
  profileScraped(name: string, url: string): void {
    this.debug(`Scraped profile: ${name}`, { url })
  }

  // Log profile saved
  profileSaved(name: string, id: string, action: 'inserted' | 'updated'): void {
    this.info(`Profile ${action}: ${name}`, { id })
  }

  // Log error during scraping
  scrapingError(url: string, error: Error): void {
    this.error(`Failed to scrape ${url}`, {
      error: error.message,
      stack: error.stack,
    })
  }
}

// Export singleton instance
export const logger = new Logger(
  path.join(process.cwd(), 'profiles', 'logs')
)

export default logger
