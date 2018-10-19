import * as React from 'react'
import { NormalizedItem } from '../../../helpers/normalizeItem'
import { SegmentedRow } from '@mcro/ui'
import { TitleBarButton } from './TitleBarButton'
import { Actions } from '../../../actions/Actions'
import { OrbitIcon } from '../../../views/OrbitIcon'

export const BitTitleActions = ({ normalizedItem }: { normalizedItem: NormalizedItem }) => {
  return (
    <SegmentedRow>
      <TitleBarButton
        onClick={() => {
          Actions.open(normalizedItem.locationLink)
          Actions.closeOrbit()
        }}
        icon={<OrbitIcon icon={normalizedItem.icon} size={16} />}
        tooltip={normalizedItem.location}
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
