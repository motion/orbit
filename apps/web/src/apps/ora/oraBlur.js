import * as React from 'react'
import { view } from '@mcro/black'

const prevent = e => {
  console.log('preventing')
  e.preventDefault()
  e.stopPropagation()
}

@view
export default class OraBlur {
  render({ oraStore }) {
    return (
      <overlay
        if={oraStore.wasBlurred}
        $$fullscreen
        css={{
          zIndex: 100000000000,
        }}
        onMouseDown={prevent}
        onClick={prevent}
      />
    )
  }
}
