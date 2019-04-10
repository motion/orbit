import { useModels } from '@o/bridge'
import { gloss } from '@o/gloss'
import { Bit, BitModel } from '@o/models'
import { ChatMessages, Divider, Row, Section, Tab, Tabs, View } from '@o/ui'
import * as React from 'react'
import { AppBitMainProps } from '../types/AppDefinition'
import { BitStatusBar } from '../views/BitStatusBar'

const Pane = gloss(View, {
  height: 0,
  opacity: 0,
  pointerEvents: 'none',
  overflow: 'hidden',
  isShown: {
    flex: 1,
    height: 'auto',
    opacity: 1,
    pointerEvents: 'inherit',
  },
})

const ConvoGroup = ({ bits }: { bits: Bit[] }) => {
  if (!bits) {
    return null
  }
  return (
    <>
      {bits.map(bit => {
        return (
          <React.Fragment key={bit.id}>
            <ChatMessages
              key={bit.id}
              messages={(bit.data as any).messages} // todo(nate) looks like hardcoded to specific data property
            />
            <Divider pad />
          </React.Fragment>
        )
      })}
    </>
  )
}

export function BitConversation(props: AppBitMainProps) {
  const { item } = props

  const [nextConvos] = useModels(BitModel, {
    where: {
      app: item.app,
      type: item.type,
      location: {
        name: item.location.name,
      },
      bitCreatedAt: {
        $moreThan: item.bitCreatedAt,
      },
    },
    relations: ['people'],
    take: 5,
    order: {
      bitCreatedAt: 'DESC',
    },
  })

  const [prevConvos] = useModels(BitModel, {
    where: {
      app: item.app,
      type: item.type,
      location: {
        name: item.location.name,
      },
      bitCreatedAt: {
        $lessThan: item.bitCreatedAt,
      },
    },
    relations: ['people'],
    take: 5,
    order: {
      bitCreatedAt: 'DESC',
    },
  })

  const [activePane, setActivePane] = React.useState(0)

  return (
    <>
      <Row alignItems="center" justifyContent="center" width="100%" margin={[-40, 0, 20]}>
        <Tabs centered sizeRadius={2} onActive={i => setActivePane(+i)} active={`${activePane}`}>
          <Tab id="0" label="Conversation" />
          <Tab id="2" label="Afterwards" />
        </Tabs>
      </Row>

      <Pane isShown={activePane === 0}>
        <Section flex={1} pad scrollable="y">
          <ConvoGroup bits={prevConvos.reverse()} />
          {!!props.item && <ChatMessages messages={props.item.data.messages} />}
        </Section>
      </Pane>

      <Pane isShown={activePane === 2}>
        <Section flex={1} pad scrollable="y">
          <ConvoGroup bits={nextConvos} />
        </Section>
      </Pane>

      <BitStatusBar {...props} />
    </>
  )
}
