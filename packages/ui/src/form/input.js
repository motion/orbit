// @flow
import React from 'react'
import { color, inject, view } from '@mcro/black'
import Surface from '../surface'
import type { Color } from '@mcro/gloss'

@view
export default class Input {
  render() {
    return (
      <Surface
        $input
        width={150}
        borderRadius={0}
        padding={[0, 10]}
        {...this.props}
        tagName="input"
        wrapElement
      />
    )
  }

  static style = {
    input: {
      // background: 'transparent',
      border: 'none',
      width: '100%',
      height: '100%',
    },
  }
}
