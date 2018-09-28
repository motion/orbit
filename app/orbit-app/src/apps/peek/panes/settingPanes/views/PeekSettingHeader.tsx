import * as React from 'react'
import { PeekHeader } from '../../../views/PeekHeader'
import { Setting } from '@mcro/models'
import { NICE_INTEGRATION_NAMES } from '../../../../../constants'
import { TitleBarButton } from '../../../views/TitleBarButton'

export const PeekSettingHeader = ({
  setting,
  onClickSettings,
  settingsActive,
}: {
  setting: Setting
  onClickSettings: Function
  settingsActive: boolean
}) => {
  return (
    <PeekHeader
      title={NICE_INTEGRATION_NAMES[setting.type]}
      subtitleAfter={
        <TitleBarButton
          tooltip="Settings"
          icon="gear"
          onClick={onClickSettings}
          active={settingsActive}
        />
      }
    />
  )
}
