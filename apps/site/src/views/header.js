import * as React from 'react'
import * as UI from '@mcro/ui'
import { SectionContent } from '~/views'
import * as Constants from '~/constants'
import Logo from './logo'
import Router from '~/router'

const MenuItem = props => (
  <UI.Link
    router={Router}
    css={{
      padding: [5, 25],
      fontWeight: 600,
      color: props.color || Constants.colorSecondary,
      cursor: 'pointer',
    }}
    {...props}
  />
)

export default () => (
  <tophead
    css={{
      background: 'transparent',
      padding: [10, 0],
      margin: [0, -25],
      position: 'relative',
      zIndex: 10,
    }}
  >
    <SectionContent row css={{ justifyContent: 'space-between' }}>
      <Logo color="#fff" />

      <menu css={{ flexFlow: 'row', padding: [0, 100, 0, 70] }}>
        <MenuItem to="/sales" color="#fff">
          For Sales
        </MenuItem>
        <MenuItem to="/support" color="#fff">
          For Support
        </MenuItem>
        <MenuItem to="/pricing" color="#fff">
          Pricing
        </MenuItem>
      </menu>

      <end css={{ width: 180, alignItems: 'flex-end' }}>
        <UI.Button
          icon="objects_planet"
          iconAfter
          size={1.2}
          fontWeight={200}
          theme="#000"
          color="#fff"
        >
          Download
        </UI.Button>
      </end>
    </SectionContent>
  </tophead>
)
