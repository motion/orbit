export * from './Logger'
export * from './LoggerSettings'

if (typeof window === 'undefined') {
  exports.logFile = require('electron-log').transports.file
}
