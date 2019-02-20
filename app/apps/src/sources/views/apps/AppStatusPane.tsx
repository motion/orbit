import * as React from 'react'
import { Setting } from '@mcro/models'
import { View, Row } from '@mcro/ui'
import { SubTitle, VerticalSpace } from '../../../views'
import { Message } from '../../../views/Message'
import { Icon } from '../../../views/Icon'

type Props = {
  setting: Setting
  extraMessage?: React.ReactNode
}

export class AppStatusPane extends React.Component<Props> {
  render() {
    const { setting, extraMessage } = this.props
    return (
      <View flex={1} alignItems="center" justifyContent="center" padding={30}>
        <SubTitle size={2.8}>Active</SubTitle>
        <VerticalSpace />
        <Row alignItems="center">
          <Icon size={28} icon={setting.type} />
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
