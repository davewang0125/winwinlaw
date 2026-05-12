/**
 * Logger for State Bar API operations
 */

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
      `barapi-${new Date().toISOString().split('T')[0]}.log`
    )

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

    if (level === 'error') {
      console.error(formatted)
    } else if (level === 'warn') {
      console.warn(formatted)
    } else {
      console.log(formatted)
    }

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
    if (process.env.DEBUG || process.env.LOG_LEVEL === 'debug') {
      this.write('debug', message, meta)
    }
  }

  startSession(state: string): void {
    this.info(`Starting State Bar API sync for ${state}`)
  }

  endSession(state: string, stats: any): void {
    this.info(`Completed State Bar API sync for ${state}`, stats)
  }

  apiRequest(endpoint: string, params?: any): void {
    this.debug(`API Request: ${endpoint}`, params)
  }

  attorneySaved(name: string, barNumber: string, action: string): void {
    this.info(`Attorney ${action}: ${name} (Bar #${barNumber})`)
  }
}

export const logger = new Logger(
  path.join(process.cwd(), 'barapi', 'logs')
)

export default logger
