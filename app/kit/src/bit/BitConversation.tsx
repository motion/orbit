import { useModels } from '@o/bridge'
import { gloss } from '@o/gloss'
import { Bit, BitModel } from '@o/models'
import { ChatMessages, Divider, Row, ScrollableContent, Tab, Tabs, View } from '@o/ui'
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
            <Divider padded />
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
      <Row alignItems="center" justifyContent="center" width="100%" margin={[20, 0]}>
        <Tabs onActive={i => setActivePane(+i)} active={`${activePane}`}>
          <Tab id="0" label="Conversation" />
          <Tab id="2" label="Afterwards" />
        </Tabs>
      </Row>

      <Pane isShown={activePane === 0}>
        <ScrollableContent paddingBottom={50} key={prevConvos.length} scrollTo="#start">
          <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
            <ConvoGroup bits={prevConvos.reverse()} />
            {!!props.item && <ChatMessages messages={props.item.data.messages} />}
          </div>
        </ScrollableContent>
      </Pane>

      <Pane isShown={activePane === 2}>
        <ScrollableContent paddingBottom={50}>
          <ConvoGroup bits={nextConvos} />
        </ScrollableContent>
      </Pane>

      <BitStatusBar {...props} />
    </>
  )
}
