import * as React from 'react'
import { Setting } from '@mcro/models'
import { View, Icon, Row } from '@mcro/ui'
import { SubTitle, VerticalSpace } from '../../../../views'
import { getSettingTitle } from '../../../../helpers/toAppConfig/settingToAppConfig'
import { Message } from '../../../../views/Message'
import { OrbitIcon } from '../../../../views/OrbitIcon'

type Props = {
  setting: Setting
  extraMessage?: React.ReactNode
}

export class AppStatusPane extends React.Component<Props> {
  render() {
    const { setting, extraMessage } = this.props
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={30}>
        <SubTitle>{getSettingTitle(setting)} is active.</SubTitle>
        <VerticalSpace />
        <Message className="markdown">
          Orbit builds a smart index that has all your relevant information
          without overfilling your hard drive.{' '}
          <a href="https://tryorbit.com/about-index">Learn how it works</a>.
          {extraMessage}
        </Message>
        <VerticalSpace />
        <Row>
          <OrbitIcon size={32} icon={setting.type} />
          <div style={{ width: 20 }} />
          <Icon size={32} color="green" name="check" />
        </Row>
      </View>
    )
  }
}
