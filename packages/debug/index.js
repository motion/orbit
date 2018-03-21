const global = require('global')
const stringify = require('stringify-object')
const Mobx = require('mobx')

if (!global.__shouldLog) {
  global.__shouldLog = {
    '*': true,
  }
  if (!global.quiet) {
    global.quiet = (logName = '*') => {
      if (global.__shouldLog[logName] === false) {
        global.__shouldLog[logName] = true
      } else {
        global.__shouldLog[logName] = false
      }
    }
  }
}

let id = 0

module.exports = function debug(namespace) {
  const uid = id++
  return function log(...messages) {
    if (
      global.__shouldLog['*'] === false ||
      global.__shouldLog[namespace] === false
    ) {
      return
    }
    colorfulLog(uid, namespace, messages)
  }
}

function nodeStringify(_thing) {
  let thing = Mobx.toJS(_thing)
  if (!thing) {
    return `${thing}`
  }
  if (Array.isArray(thing)) {
    return `[${thing.map(nodeStringify).join(',')}]`
  }
  if (thing instanceof Object) {
    return stringify(thing, {
      indent: '  ',
      inlineCharacterLimit: 50,
      singleQuotes: false,
    })
  }
  if (thing.toString) {
    return thing.toString()
  }
  return `${thing}`
}

const isBrowser = typeof window !== 'undefined'

function colorfulLog(id, namespace, messages) {
  if (!isBrowser) {
    console.log(`${namespace}: ${messages.map(nodeStringify).join(' ')}`)
  } else {
    console.log(`${namespace}:`, ...messages)
  }
}
