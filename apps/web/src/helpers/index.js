// @flow
export * from 'mobx'
export { Component } from 'react'
export debug from 'debug'

class Cache {
  all = new Set()
  add = item => this.all.add(item)
  remove = item => this.all.delete(item)
}
export const viewCache = new Cache()
