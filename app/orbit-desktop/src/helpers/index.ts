export { default as runAppleScript } from './runAppleScript'
export { default as escapeAppleScriptString } from 'escape-string-applescript'
export { default as getCrawler } from './getCrawler'
export const sleep = ms => new Promise(res => setTimeout(res, ms))

import Crypto from 'crypto'
import { writeJSON } from 'fs-extra'
import { getGlobalConfig } from '@mcro/config'
export const hash = x =>
  Crypto.createHash('md5')
    .update(x instanceof Object ? JSON.stringify(x) : `${x}`)
    .digest('hex')

export const writeOrbitConfig = async () =>
  await writeJSON(getGlobalConfig().paths.orbitConfig, getGlobalConfig())
