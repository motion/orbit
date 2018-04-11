export { default as runAppleScript } from './runAppleScript'
export { default as escapeAppleScriptString } from 'escape-string-applescript'
export { default as getCrawler } from './getCrawler'
export const sleep = ms => new Promise(res => setTimeout(res, ms))
export * from './injections'
export { default as recoverDB } from './recoverDB'

import Crypto from 'crypto'
export const hash = x =>
  Crypto.createHash('md5')
    .update(x instanceof Object ? JSON.stringify(x) : `${x}`)
    .digest('hex')
