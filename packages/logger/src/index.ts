export * from './Logger'
export * from './LoggerSettings'

export const logFile =
  typeof window === 'undefined' ? require('electron-log').transports.file : null
