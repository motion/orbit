import { useModels } from '@mcro/model-bridge'
import { Bit, BitModel, GenericBit } from '@mcro/models'
import { Button, Row, SegmentedRow } from '@mcro/ui'
import * as React from 'react'
import { Divider } from '../../../../views/Divider'
import { Pane } from '../../../../views/Pane'
import { SectionTitle } from '../../../../views/Section'
import { OrbitSourceMainProps } from '../../../types'
import { ChatMessages } from '../../../views/bits/chat/ChatMessages'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import ScrollableContent from '../../../views/layout/ScrollableContent'

type Props = OrbitSourceMainProps<'slack'>

const ConvoGroup = ({ bits }: { bits: Bit[] }) => {
  if (!bits) {
    return null
  }
  return (
    <>
      {bits.map(bit => {
        return (
          <React.Fragment key={bit.id}>
            <ChatMessages key={bit.id} item={bit as GenericBit<'slack'>} />
            <Divider />
          </React.Fragment>
        )
      })}
    </>
  )
}

export default React.memo(function SlackApp(props: Props) {
  const { item } = props

  const [nextConvos] = useModels(BitModel, {
    where: {
      integration: item.integration,
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
      integration: item.integration,
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
          <Button>Conversation</Button>
          <Button>Previously</Button>
          <Button>Afterwards</Button>
          <Button>Related</Button>
        </SegmentedRow>
      </Row>

      <Pane isShown={activePane === 0}>
        <ScrollableContent key={prevConvos.length} scrollTo="#start">
          <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
            {!!props.item && <ChatMessages item={props.item} />}
          </div>
        </ScrollableContent>
      </Pane>

      <ScrollableContent>
        <Pane isShown={activePane === 1}>
          <SectionTitle>Previously</SectionTitle>
          <ConvoGroup bits={prevConvos.reverse()} />
        </Pane>

        <Pane isShown={activePane === 2}>
          <SectionTitle>Afterwards</SectionTitle>
          <ConvoGroup bits={nextConvos} />
        </Pane>

        <Pane isShown={activePane === 3}>
          <SectionTitle>Related</SectionTitle>
          related items
        </Pane>
      </ScrollableContent>

      <BitStatusBar {...props} />
    </>
  )
})
