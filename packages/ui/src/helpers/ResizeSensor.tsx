/**
 * Copyright 2018-present Facebook.
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * @format
 */

import { view } from '@mcro/black'
import * as React from 'react'

const IFrame = view('iframe', {
  height: '100%',
  width: '100%',
  border: 'none',
  background: 'transparent',
  position: 'absolute',
  zIndex: -1,
  top: 0,
  left: 0,
})

export class ResizeSensor extends React.Component<{
  onResize: (e: any) => void
}> {
  iframe: HTMLIFrameElement | void

  setRef = (ref: HTMLIFrameElement | void) => {
    this.iframe = ref
  }

  render() {
    return <IFrame forwardRef={this.setRef} />
  }

  componentDidMount() {
    const { iframe } = this
    if (iframe) {
      iframe.contentWindow.addEventListener('resize', this.handleResize)
    }
  }

  componentWillUnmount() {
    const { iframe } = this
    if (iframe) {
      iframe.contentWindow.removeEventListener('resize', this.handleResize)
    }
  }

  handleResize = () => {
    window.requestAnimationFrame(this.props.onResize)
  }
}
