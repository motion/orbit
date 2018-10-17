import * as React from 'react'
import { NormalizedItem } from '../../components/ItemResolver'
import { SegmentedRow } from '@mcro/ui'
import { TitleBarButton } from './TitleBarButton'
import { Actions } from '../../actions/Actions'
import { OrbitIcon } from '../../views/OrbitIcon'

export const BitTitleActions = ({ normalizedItem }: { normalizedItem: NormalizedItem }) => {
  return (
    <SegmentedRow>
      <TitleBarButton
        onClick={() => {
          Actions.open(normalizedItem.locationLink)
          Actions.closeOrbit()
        }}
        icon={<OrbitIcon icon={normalizedItem.icon} size={16} />}
        tooltip={location}
      />
      <TitleBarButton
        onClick={() => {
          Actions.open(normalizedItem.desktopLink || normalizedItem.webLink)
          Actions.closeOrbit()
        }}
        tooltip="Open"
      >
        Open
      </TitleBarButton>
    </SegmentedRow>
  )
}
