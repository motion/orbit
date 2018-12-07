import * as React from 'react'
import { NormalItem } from '../../../helpers/normalizeItem'
import { SegmentedRow } from '@mcro/ui'
import { TitleBarButton } from './TitleBarButton'
import { AppActions } from '../../../actions/AppActions'
import { OrbitIcon } from '../../../views/OrbitIcon'

export const BitTitleActions = ({ normalizedItem }: { normalizedItem: Partial<NormalItem> }) => {
  return (
    <SegmentedRow>
      <TitleBarButton
        onClick={() => {
          AppActions.open(normalizedItem.locationLink)
          AppActions.setOrbitDocked(false)
        }}
        icon={<OrbitIcon icon={normalizedItem.icon} size={16} />}
        tooltip={normalizedItem.location}
      />
      <TitleBarButton
        onClick={() => {
          AppActions.open(normalizedItem.desktopLink || normalizedItem.webLink)
          AppActions.setOrbitDocked(false)
        }}
        tooltip="Open"
      >
        Open
      </TitleBarButton>
    </SegmentedRow>
  )
}
