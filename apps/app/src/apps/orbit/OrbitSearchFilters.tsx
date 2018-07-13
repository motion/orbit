import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { RoundButton } from '../../views'
import { OrbitIcon } from './OrbitIcon'

export const OrbitSearchFilters = view(({ appStore, searchStore }) => {
  appStore
  searchStore
  return (
    <UI.Row width="100%" padding={[0, 0, 10]}>
      <UI.PassProps circular size={1.2} marginRight={5}>
        <RoundButton icon={<OrbitIcon size={22} icon="slack" />} />
        <RoundButton icon={<OrbitIcon size={22} icon="gdrive" />} />
        <RoundButton icon={<OrbitIcon size={22} icon="gmail" />} />
        <RoundButton icon={<OrbitIcon size={22} icon="confluence" />} />
        <RoundButton icon={<OrbitIcon size={22} icon="jira" />} />
        <RoundButton icon={<OrbitIcon size={22} icon="github" />} />
      </UI.PassProps>
      <UI.Col flex={1} />
      <UI.Popover
        openOnClick
        openOnHover
        closeOnEsc
        background
        borderRadius={6}
        elevation={3}
        arrowSize={12}
        distance={4}
        target={<RoundButton debug>All</RoundButton>}
      >
        <UI.List>
          <UI.ListItem>Hello world</UI.ListItem>
        </UI.List>
      </UI.Popover>
    </UI.Row>
  )
})
