import * as React from 'react'
import { OrbitIntegrationMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { Surface, View } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { BitTitleBar } from '../../../views/layout/BitTitleBar'
import { view, ensure, react } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { BitModel, GenericBit, Bit } from '@mcro/models'
import { ChatMessages } from '../../../views/bits/chat/ChatMessages'
import { Divider } from '../../../../views/Divider'

type Props = OrbitIntegrationMainProps<'slack'>

class SlackAppStore {
  props: Props

  nextConvos = react(
    () => this.props.bit,
    bit => {
      ensure('bit', !!bit)
      return observeMany(BitModel, {
        args: {
          where: {
            integration: bit.integration,
            type: bit.type,
            location: {
              name: bit.location.name,
            },
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
    {
      defaultValue: [],
    },
  )

  prevConvos = react(
    () => this.props.bit,
    bit => {
      ensure('bit', !!bit)
      return observeMany(BitModel, {
        args: {
          where: {
            integration: bit.integration,
            type: bit.type,
            location: {
              name: bit.location.name,
            },
            bitCreatedAt: {
              $lessThan: bit.bitCreatedAt,
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
    {
      defaultValue: [],
    },
  )
}

const ConvoGroup = ({ bits }: { bits: Bit[] }) => {
  if (!bits) {
    return null
  }
  return (
    <>
      {bits.map(bit => {
        return (
          <>
            <ChatMessages key={bit.id} bit={bit as GenericBit<'slack'>} />
            <Divider />
          </>
        )
      })}
    </>
  )
}

@view.attach({
  store: SlackAppStore,
})
@view
export class SlackApp extends React.Component<Props & { store: SlackAppStore }> {
  render() {
    const { bit, store } = this.props
    return (
      <Surface flexFlow="column" hover={false} noInnerElement padding={[16, 12]} flex={1}>
        <BitTitleBar {...this.props} />
        <ScrollableContent key={store.prevConvos.length} scrollTo="#start">
          <View padding={[16, 0]}>
            <ConvoGroup bits={store.prevConvos.reverse()} />
            <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
              {!!bit && <ChatMessages bit={bit} />}
            </div>
            <ConvoGroup bits={store.nextConvos} />
            {/* ensure we have room to scroll */}
            <View height={200} />
          </View>
        </ScrollableContent>
        <AppStatusBar {...this.props} />
      </Surface>
    )
  }
}
