export runAppleScript from './runAppleScript'
export getContext from './getContext'
export getAppSize from './getAppSize'
export getScreenSize from './getScreenSize'
export open from 'opn'
export escapeAppleScriptString from 'escape-string-applescript'
export getExtensions from './getExtensions'
export getCrawler from './getCrawler'
export const sleep = ms => new Promise(res => setTimeout(res, ms))
