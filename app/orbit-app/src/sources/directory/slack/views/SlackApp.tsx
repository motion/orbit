import * as React from 'react'
import { OrbitSourceMainProps } from '../../../types'
import ScrollableContent from '../../../views/layout/ScrollableContent'
import { SegmentedRow, Button, Theme, Row, ThemeContext, color } from '@mcro/ui'
import { BitStatusBar } from '../../../views/layout/BitStatusBar'
import { useModels } from '@mcro/model-bridge'
import { BitModel, GenericBit, Bit } from '@mcro/models'
import { ChatMessages } from '../../../views/bits/chat/ChatMessages'
import { Divider } from '../../../../views/Divider'
import { Pane } from '../../../../views/Pane'
import { Title } from '../../../../views'

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
            <ChatMessages key={bit.id} bit={bit as GenericBit<'slack'>} />
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
  const { activeTheme, allThemes } = React.useContext(ThemeContext)

  return (
    <>
      <Theme
        theme={{
          color: color(activeTheme.color).alpha(0.5),
          colorActive: allThemes.selected.background,
          backgroundHover: activeTheme.backgroundHover,
          borderColor: 'transparent',
        }}
      >
        <Row alignItems="center" justifyContent="center" width="100%" margin={[0, 0, 8]}>
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
      </Theme>

      <Pane isShown={activePane === 0}>
        <ScrollableContent key={prevConvos.length} scrollTo="#start">
          <div id="start" style={{ paddingTop: 16, marginTop: -16 }}>
            {!!props.item && <ChatMessages bit={props.item} />}
          </div>
        </ScrollableContent>
      </Pane>

      <ScrollableContent>
        <Pane isShown={activePane === 1}>
          <Title>Previously</Title>
          <ConvoGroup bits={prevConvos.reverse()} />
        </Pane>

        <Pane isShown={activePane === 2}>
          <Title>Afterwards</Title>
          <ConvoGroup bits={nextConvos} />
        </Pane>

        <Pane isShown={activePane === 3}>
          <Title>Related</Title>
          related items
        </Pane>
      </ScrollableContent>

      <BitStatusBar {...props} />
    </>
  )
})
