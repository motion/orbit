// @flow
import React from 'react'

import { Shortcuts as ReactShortcuts } from 'react-shortcuts'
import { view } from '@jot/black'
import { findDOMNode } from 'react-dom'

export * from 'mobx'
export { Component } from 'react'
export $ from '@jot/black/lib/gloss'
export debug from 'debug'

import _keyCode from 'keycode'
// fix react synth event
export const keycode = (event: Event) => {
  event.persist()
  const code = _keyCode(event)
  if (localStorage.debug) {
    console.log(code)
  }
  return code
}

@view
export class Shortcuts {
  render() {
    return (
      <ReactShortcuts $shortcuts isolate alwaysFireHandler {...this.props} />
    )
  }
  static style = {
    shortcuts: {
      height: '100%',
      width: '100%',
    },
  }
}

type Target = string | (() => React$Children | React$Children)

export const getTarget = (target: Target) => {
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

class Cache {
  all = new Set()
  add = item => this.all.add(item)
  remove = item => this.all.delete(item)
}
export const viewCache = new Cache()
