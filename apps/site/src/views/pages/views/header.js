import * as React from 'react'
import * as UI from '@mcro/ui'
import * as View from '~/views'
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
      position: 'relative',
      zIndex: 10,
    }}
  >
    <View.SectionContent row css={{ justifyContent: 'space-between' }}>
      <Logo color="#fff" />

      <menu css={{ flexFlow: 'row', padding: [0, 100] }}>
        <MenuItem to="/sales" color="#fff">
          For Sales
        </MenuItem>
        <MenuItem to="/support" color="#fff">
          For Support
        </MenuItem>
        <MenuItem to="/pricing">Pricing</MenuItem>
      </menu>

      <end>
        <UI.Button
          icon="objects_planet"
          iconAfter
          size={1.5}
          theme="rgb(6.1%, 53.4%, 22.6%)"
          color="#fff"
        >
          Download
        </UI.Button>
      </end>
    </View.SectionContent>
  </tophead>
)
