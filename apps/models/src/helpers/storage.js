const isNode = typeof process !== 'undefined' && process.release.name === 'node'

let Storage = {}

// node vs browser pouch storage
if (isNode) {
  Storage.adapter = require('pouchdb-adapter-memory')
  Storage.name = 'memory'
} else {
  Storage.adapter = require('pouchdb-adapter-idb')
  Storage.name = 'idb'
}

export default Storage
