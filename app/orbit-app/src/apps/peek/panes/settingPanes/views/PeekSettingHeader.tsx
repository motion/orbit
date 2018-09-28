import * as React from 'react'
import { PeekHeader } from '../../../views/PeekHeader'
import { Setting } from '@mcro/models'
import { NICE_INTEGRATION_NAMES } from '../../../../../constants'
import { TitleBarButton } from '../../../views/TitleBarButton'

export const PeekSettingHeader = ({
  setting,
  onClickSettings,
}: {
  setting: Setting
  onClickSettings: Function
}) => {
  return (
    <PeekHeader
      title={NICE_INTEGRATION_NAMES[setting.type]}
      titleAfter={<TitleBarButton tooltip="Settings" icon="gear" onClick={onClickSettings} />}
    />
  )
}
