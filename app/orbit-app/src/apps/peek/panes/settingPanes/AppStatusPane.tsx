import * as React from 'react'
import { Setting } from '@mcro/models'
import { View, Icon, Row } from '@mcro/ui'
import { SubTitle, VerticalSpace } from '../../../../views'
import { getSettingTitle } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { Message } from '../../../../views/Message'
import { OrbitIcon } from '../../../../views/OrbitIcon'
import { view } from '@mcro/black'

type Props = {
  setting: Setting
  extraMessage?: React.ReactNode
}

class AppStore {}

@view.attach({
  store: AppStore,
})
@view
export class AppStatusPane extends React.Component<Props> {
  render() {
    const { setting, extraMessage } = this.props
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={30}>
        <SubTitle size={2.8}>{getSettingTitle(setting)} is active.</SubTitle>
        <VerticalSpace />
        <Row alignItems="center">
          <OrbitIcon size={28} icon={setting.type} />
          <div style={{ width: 20 }} />
          <Icon size={28} color="green" name="check" />
        </Row>
        <VerticalSpace />
        <Message size={1.2}>
          Orbit will smart sync information thats relevant to you by default. To manage it manually,
          click Manage.
          <VerticalSpace />
          <View alignItems="center" justifyContent="center" flex={1} flexFlow="row">
            <a href="https://tryorbit.com/about-index">Learn how it works</a>.
          </View>
          {extraMessage}
        </Message>
      </View>
    )
  }
}
