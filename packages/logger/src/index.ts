import { Logger } from './Logger'

export * from './Logger'
export * from './LoggerSettings'

export const logFile: any = {}
// typeof window === 'undefined' ? require('electron-log').transports.file : null

export const reporter = new Logger('')
