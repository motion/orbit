export * from 'mobx'
export { Component } from 'react'
export node from './node'
export view from './view'
export store from './store'
export $ from './styles'
export { query } from '@jot/models'
export clr from 'color'
export { Shortcuts } from 'react-shortcuts'

import { findDOMNode } from 'react-dom'

export const getTarget = target => {
  if (!target) {
    return null
  }
  switch (typeof target) {
    case 'string':
      return document.querySelector(target)
    case 'function':
      return findDOMNode(target())
  }
  try {
    return findDOMNode(target)
  } catch (e) {
    return target
  }
}
