export * from 'mobx'
export { Component } from 'react'
export node from './node'
export view from './view'
export $ from './styles'
export { query } from 'models'
export clr from 'color'

import { findDOMNode } from 'react'

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
