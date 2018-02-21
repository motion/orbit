// @flow
import view_ from './view'
import store_ from './store'
import ProvideStore_ from './provideStore'
import { observable, autorunAsync } from 'mobx'

export log from './helpers/log'
export watch from './helpers/watch'

export const view = view_
export const store = store_
export const ProvideStore = ProvideStore_

// constants
import * as Constants_ from './constants'
export const Constants = Constants_

import * as React from 'react'
export const { Component } = React

// allows easy tracking of all views/stores
export function debugState(callback) {
  if (typeof callback !== 'function') {
    throw new Error(`debugState requires a callback`)
  }
  const state = observable({
    mounted: {
      stores: {},
      views: {},
    },
    mountedVersion: 0,
  })
  const getKey = (name: string, thing: Class<any>) =>
    name === 'store' ? thing.constructor.name : name
  const mount = (type: string) => ({ name, thing }) => {
    const key = getKey(name, thing)
    state.mounted[type][key] = state.mounted[type][key] || new Set()
    state.mounted[type][key].add(thing)
    state.mountedVersion++
  }
  const unmount = (type: string) => ({ name, thing }) => {
    const key = getKey(name, thing)
    if (state.mounted[type][key]) {
      state.mounted[type][key].delete(thing)
      state.mountedVersion++
    }
  }
  // watch things
  autorunAsync(() => {
    state.mountedVersion
    const reduce = object =>
      Object.keys(object).reduce((acc, key) => {
        const entries = []
        object[key].forEach(store => {
          entries.push(store)
        })
        return {
          ...acc,
          // nice helper: turn just one array into a singular item
          [key]: entries.length === 1 ? entries[0] : entries,
        }
      }, {})

    const stores = reduce(state.mounted.stores)
    const views = reduce(state.mounted.views)
    callback({ stores, views })
  }, 100)
  view.on('store.mount', mount('stores'))
  view.on('store.unmount', unmount('stores'))
  view.provide.on('store.mount', mount('stores'))
  view.provide.on('store.unmount', unmount('stores'))
  view.on('view.mount', mount('views'))
  view.on('view.unmount', unmount('views'))
}
