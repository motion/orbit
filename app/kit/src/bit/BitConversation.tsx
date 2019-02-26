import { useModels } from '@mcro/bridge'
import { gloss, View } from '@mcro/gloss'
import { Bit, BitModel, GenericBit } from '@mcro/models'
import {
  Button,
  ChatMessages,
  Divider,
  Row,
  ScrollableContent,
  SegmentedRow,
  Title,
} from '@mcro/ui'
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
              messages={(bit as GenericBit<'AppIdentifier'>).data.messages}
            />
            <Divider />
          </React.Fragment>
        )
      })}
    </>
  )
}

export function Conversation(props: AppBitMainProps) {
  const { item } = props

  const [nextConvos] = useModels(BitModel, {
    where: {
      source: item.source,
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
      source: item.source,
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
        <SegmentedRow
          spaced={0}
          active={activePane}
          onChange={setActivePane}
          itemProps={{ chromeless: true, fontWeight: 600, sizeFont: 1.1, size: 0.9 }}
        >
          <Button onClick={() => setActivePane(0)}>Conversation</Button>
          <Button onClick={() => setActivePane(1)}>Previously</Button>
          <Button onClick={() => setActivePane(2)}>Afterwards</Button>
          <Button onClick={() => setActivePane(3)}>Related</Button>
        </SegmentedRow>
      </Row>

      <Pane isShown={activePane === 0}>
        <ScrollableContent paddingBottom={50} key={prevConvos.length} scrollTo="#start">
          <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
            {!!props.item && <ChatMessages {...props.item} />}
          </div>
        </ScrollableContent>
      </Pane>

      <Pane isShown={activePane === 1}>
        <Title>Previously</Title>
        <ScrollableContent paddingBottom={50}>
          <ConvoGroup bits={prevConvos.reverse()} />
        </ScrollableContent>
      </Pane>

      <Pane isShown={activePane === 2}>
        <Title>Afterwards</Title>
        <ScrollableContent paddingBottom={50}>
          <ConvoGroup bits={nextConvos} />
        </ScrollableContent>
      </Pane>

      <BitStatusBar {...props} />
    </>
  )
}
