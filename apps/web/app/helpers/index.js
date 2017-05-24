export * from 'mobx'
export { Component } from 'react'
export view from './view'
export store from './store'
export $ from './styles'
export { query } from '@jot/models'
export clr from 'color'

import kc from 'keycode'
// fix react synth event
export const keycode = (event: Event) => {
  event.persist()
  const code = kc(event)
  if (localStorage.debug) {
    console.log(code)
  }
  return code
}

// todo move into own thing
import { Shortcuts as ReactShortcuts } from 'react-shortcuts'
import view from './view'

@view
export class Shortcuts {
  render() {
    return <ReactShortcuts $shortcuts isolate {...this.props} />
  }
  static style = {
    shortcuts: {
      height: '100%',
      width: '100%',
    },
  }
}

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
