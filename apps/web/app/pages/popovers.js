import React from 'react'
import { view } from '~/helpers'
import { Button, Popover } from '~/ui'

@view
export default class PopoversTest {
  render() {
    return (
      <page if={true}>
        <Button tooltip="top" tooltipProps={{ open: true, towards: 'top' }}>
          top
        </Button>
        <Button tooltip="left" tooltipProps={{ open: true, towards: 'left' }}>
          left
        </Button>
        <Button tooltip="right" tooltipProps={{ open: true, towards: 'right' }}>
          right
        </Button>
        <Button
          tooltip="bottom"
          tooltipProps={{ open: true, towards: 'bottom' }}
        >
          bottom
        </Button>

        <Button
          $auto
          tooltip="auto"
          tooltipProps={{ open: true, towards: 'auto' }}
        >
          auto
        </Button>
        <Button
          $auto
          $top
          tooltip="auto"
          tooltipProps={{ open: true, towards: 'auto' }}
        >
          auto
        </Button>
      </page>
    )
  }

  static style = {
    page: {
      flex: 1,
      padding: 200,
    },
    auto: {
      position: 'absolute',
      bottom: 0,
      left: 0,
    },
    top: {
      bottom: 'auto',
      left: 'auto',
      right: 0,
      top: 0,
    },
  }
}
