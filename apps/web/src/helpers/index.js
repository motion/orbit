// @flow
export * from 'mobx'
export { Component } from 'react'
export debug from 'debug'
export fuzzy from './fuzzy'

class Cache {
  all = new Set()
  add = item => this.all.add(item)
  remove = item => this.all.delete(item)
}
export const viewCache = new Cache()

import { HotKeys as OGHotKeys } from 'react-hotkeys'

// ensures it doesnt interrupt flexing
export const HotKeys = ({ style, ...props }) =>
  <OGHotKeys
    style={{
      flex: 'inherit',
      flexFlow: 'inherit',
      flexGrow: 'inherit',
      ...style,
    }}
    {...props}
  />

export electron, { OS } from '~/helpers/electron'
