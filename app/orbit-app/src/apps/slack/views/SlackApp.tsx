import * as React from 'react'
import { OrbitAppMainProps } from '../../types'
import { ScrollableContent } from '../../views/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../views/AppStatusBar'
import { BitTitleBar } from '../../views/BitTitleBar'
import { view } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { ChatMessages } from '../../../components/bitViews/chat/ChatMessages'

type Props = OrbitAppMainProps<'slack'>

class SlackAppStore {
  props: Props

  nextConversations = []
  private nextConversations$ = observeMany(BitModel, {
    args: {
      where: {
        integration: this.props.bit.integration,
        type: this.props.bit.type,
        bitCreatedAt: {
          $moreThan: this.props.bit.bitCreatedAt,
        },
      },
      relations: ['people'],
      take: 5,
      order: {
        bitCreatedAt: 'DESC',
      },
    },
  }).subscribe(values => {
    this.nextConversations = values
  })

  willUnmount() {
    this.nextConversations$.unsubscribe()
  }
}

@view.attach({
  store: SlackAppStore,
})
export class SlackApp extends React.Component<Props & { store: SlackAppStore }> {
  render() {
    const { bit } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={16} flex={1}>
        <BitTitleBar {...this.props} />
        <ScrollableContent>
          <View padding={[16, 0]}>{!!bit && <ChatMessages bit={bit} />}</View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </Surface>
    )
  }
}
