import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import { ScrollableContent } from '../../../views/layout/ScrollableContent'
import { View, SegmentedRow, Button } from '@mcro/ui'
import { AppStatusBar } from '../../../views/layout/AppStatusBar'
import { ensure, react } from '@mcro/black'
import { observeMany } from '@mcro/model-bridge'
import { BitModel, GenericBit, Bit } from '@mcro/models'
import { ChatMessages } from '../../../views/bits/chat/ChatMessages'
import { Divider } from '../../../../views/Divider'
import { useStore } from '@mcro/use-store'
import { observer } from 'mobx-react-lite'
import { Pane } from '../../../../views/Pane'
import { Title } from '../../../../views'
import { StatusBar } from '../../../../components/StatusBar'

type Props = OrbitSourceMainProps<'slack'>

class SlackViewStore {
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
          <React.Fragment key={bit.id}>
            <ChatMessages key={bit.id} bit={bit as GenericBit<'slack'>} />
            <Divider />
          </React.Fragment>
        )
      })}
    </>
  )
}

export const SlackApp = observer((props: Props) => {
  const [activePane, setActivePane] = React.useState(0)
  const store = useStore(SlackViewStore, props)
  return (
    <View flex={1}>
      <SegmentedRow
        spaced
        active={activePane}
        onChange={setActivePane}
        itemProps={{ chromeless: true, fontWeight: 600 }}
      >
        <Button>Conversation</Button>
        <Button>Previously</Button>
        <Button>Afterwards</Button>
        <Button>Related</Button>
      </SegmentedRow>

      <Pane isShown={activePane === 0}>
        <ScrollableContent key={store.prevConvos.length} scrollTo="#start">
          <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
            {!!props.bit && <ChatMessages bit={props.bit} />}
          </div>
        </ScrollableContent>
      </Pane>

      <Pane isShown={activePane === 1}>
        <Title>Previously</Title>
        <ConvoGroup bits={store.prevConvos.reverse()} />
      </Pane>

      <Pane isShown={activePane === 2}>
        <Title>Afterwards</Title>
        <ConvoGroup bits={store.nextConvos} />
      </Pane>

      <Pane isShown={activePane === 3}>
        <Title>Related</Title>
        related items
      </Pane>

      <StatusBar>
        <AppStatusBar {...props} />
      </StatusBar>
    </View>
  )
})
