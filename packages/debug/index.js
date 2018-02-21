const global = require('global')
// const chalk = require('chalk')

if (!global.__shouldLog) {
  global.__shouldLog = {
    '*': true,
  }
}

let id = 0

module.exports = function debug(namespace) {
  const uid = id++
  return function log(...messages) {
    if (!global.__shouldLog[namespace] && !global.__shouldLog['*']) {
      return
    }
    colorfulLog(uid, namespace, messages)
  }
}

const colorWheel = ['cyan', 'magenta', 'blue', 'yellow', 'green', 'red']
const NUM_COLORS = colorWheel.length
const isBrowser = typeof window !== 'undefined'

function colorfulLog(id, namespace, messages) {
  const colorName = colorWheel[id % NUM_COLORS]
  if (!isBrowser) {
    console.log(`${namespace} -- ${messages.join(' ')}`)
  } else {
    console.log(`%c${namespace}: ${messages.join(' ')}`, `color:${colorName};`)
  }
}
