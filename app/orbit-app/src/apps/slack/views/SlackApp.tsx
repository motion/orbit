import * as React from 'react'
import { OrbitAppMainProps } from '../../types'
import { ScrollableContent } from '../../views/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../views/AppStatusBar'
import { BitTitleBar } from '../../views/BitTitleBar'
import { view, ensure, react } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { BitModel } from '@mcro/models'
import { ChatMessages } from '../../../components/bitViews/chat/ChatMessages'

type Props = OrbitAppMainProps<'slack'>

class SlackAppStore {
  props: Props

  nextConversations = react(
    () => this.props.bit,
    bit => {
      ensure('bit', !!bit)
      return observeMany(BitModel, {
        args: {
          where: {
            integration: bit.integration,
            type: bit.type,
            bitCreatedAt: {
              $moreThan: bit.bitCreatedAt,
            },
          },
          relations: ['people'],
          take: 5,
          order: {
            bitCreatedAt: 'DESC',
          },
        },
      })
    },
  )
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
