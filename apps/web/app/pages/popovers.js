import React from 'react'
import { view } from '~/helpers'
import { Segment, Button, Popover } from '~/ui'

@view
export default class PopoversTest {
  render() {
    // return null
    return (
      <page if={true}>
        <Segment>
          <Button tooltip="left" tooltipProps={{ open: true, towards: 'left' }}>
            left
          </Button>
          <Button tooltip="top" tooltipProps={{ open: true, towards: 'top' }}>
            top
          </Button>
          <Button
            tooltip="bottom"
            tooltipProps={{ open: true, towards: 'bottom' }}
          >
            bottom
          </Button>
          <Button
            tooltip="right"
            tooltipProps={{ open: true, towards: 'right' }}
          >
            right
          </Button>
        </Segment>

        <br />
        <br />
        <br />
        <br />

        forgiveness = 50
        <Segment>
          <Button
            tooltip="left"
            tooltipProps={{ open: true, forgiveness: 50, towards: 'left' }}
          >
            left
          </Button>
          <Button
            tooltip="top"
            tooltipProps={{ open: true, forgiveness: 50, towards: 'top' }}
          >
            top
          </Button>
          <Button
            tooltip="bottom"
            tooltipProps={{ open: true, forgiveness: 50, towards: 'bottom' }}
          >
            bottom
          </Button>
          <Button
            tooltip="right"
            tooltipProps={{ open: true, forgiveness: 50, towards: 'right' }}
          >
            right
          </Button>
        </Segment>

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
