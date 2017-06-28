import React from 'react'
import { view } from '@mcro/black'
import Portal from 'react-portal'

@view.ui
export default class Modal {
  render() {
    const { portalProps, bgProps, children, ...props } = this.props

    return (
      <Portal isOpened {...portalProps}>
        <bg {...bgProps}>
          <modal {...props}>{children}</modal>
        </bg>
      </Portal>
    )
  }

  static style = {
    bg: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.3)',
      zIndex: 1000000,
      justifyContent: 'center',
      alignItems: 'center',
      backdropFilter: 'blur(5px)',
    },
    modal: {
      background: '#f7f9fa',
      boxShadow: '0 0 0 1px rgba(0,0,0,0.1), 0 2px 20px rgba(0,0,0,0.2)',
      borderRadius: 5,
      margin: 100,
    },
  }

  static theme = {}
}
