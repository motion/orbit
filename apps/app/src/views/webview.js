import * as React from 'react'
import { view } from '@mcro/black'

@view
export default class WebView {
  render({ getRef, ...props }) {
    return (
      <webview
        ref={getRef}
        css={{ width: '100%', height: '100%' }}
        {...props}
      />
    )
  }

  static style = {
    location: {
      padding: 3,
    },
  }
}
