// @flow
import latinize from 'latinize'
import * as React from 'react'
import fuzzy_ from './fuzzy'

export IndexDB from './indexDB'

export const contextToResult = context => ({
  id: context.url,
  title: context.selection
    ? `${context.selection} | ${context.title}`
    : context.title,
  type: 'context',
  icon: context.application === 'Google Chrome' ? 'social-google' : null,
  image: context.favicon,
  peek: false,
})

// because honestly, its easy to forget when writing jsx
// maybe im missing something in flow
window.React = React

export const fuzzy = fuzzy_
export const Component = React.Component

class Cache {
  all: Set = new Set()
  add = (item: any) => this.all.add(item)
  remove = (item: any) => this.all.delete(item)
}
export const viewCache = new Cache()

import { HotKeys as OGHotKeys } from 'react-hotkeys'

// ensures it doesnt interrupt flexing
type Props = {
  style: any,
}

export const HotKeys = ({ style, ...props }: Props) => (
  <OGHotKeys
    style={{
      flex: 'inherit',
      flexFlow: 'inherit',
      flexGrow: 'inherit',
      ...style,
    }}
    {...props}
  />
)

import electron_, { OS as OS_ } from '~/helpers/electron'
export const electron = electron_
export const OS = OS_

// alphanumeric and spacse
export const cleanText = s => {
  if (s.toLowerCase) {
    return latinize(s || '')
      .toLowerCase()
      .replace(/[^0-9a-zA-Z\ ]/g, '')
  } else {
    return ''
  }
}

export const debounceIdle = (fn, timeout) => {
  let clearId = null
  return (...args) => {
    if (clearId) cancelIdleCallback(clearId)

    clearId = requestIdleCallback(() => fn(...args), { timeout })
  }
}
