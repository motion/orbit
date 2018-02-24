const global = require('global')
const stringify = require('stringify-object')

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

function nodeStringify(thing) {
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
    console.log(`${namespace} -- ${messages.map(nodeStringify).join(' ')}`)
  } else {
    console.log(`${namespace}:`, ...messages)
  }
}
