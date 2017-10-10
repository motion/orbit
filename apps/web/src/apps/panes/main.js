// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Pane from '~/apps/pane'
import type { PaneResult } from '~/types'
import BarMainStore from './mainStore'

const MAIN_WIDTH = 240
const itemProps = {
  size: 1.14,
  glow: true,
  padding: [10, 12],
  iconAfter: true,
}

const getDate = (result: PaneResult) =>
  result.data && result.data.updated ? UI.Date.format(result.data.updated) : ''

const getItem = ({ paneStore, mainStore }) => (result, index) => ({
  key: `${index}${result.id}`,
  highlight: () => index === paneStore.activeIndex,
  //color: [255, 255, 255, 0.6],
  primary: result.title,
  primaryEllipse: !mainStore.hasContent(result),
  children: [
    result.data &&
      result.data.body && (
        <UI.Text key={0} lineHeight={20} opacity={0.5}>
          {getDate(result) + ' · '}
          {(result.data.body && result.data.body.slice(0, 120)) || ''}
        </UI.Text>
      ),
    !result.data && <UI.Text key={1}>{getDate(result)}</UI.Text>,
  ].filter(Boolean),
  iconAfter: result.iconAfter !== false,
  icon:
    result.data && result.data.image ? (
      <img
        style={{
          width: 20,
          height: 20,
          borderRadius: 1000,
          margin: 'auto',
        }}
        src={`/images/${result.data.image}`}
      />
    ) : (
      result.icon
    ),
})

@view
class PrimaryColumn {
  render({ mainStore }) {
    return (
      <Pane.Card
        primary
        items={mainStore.results}
        width={MAIN_WIDTH}
        groupKey="category"
        itemProps={itemProps}
        getItem={getItem(this.props)}
      />
    )
  }
}

@view
class SecondaryColumn {
  render({ mainStore }) {
    return (
      <Pane.Card
        primary
        items={[
          {
            data: { message: 'my team' },
            title: 'Product',
            category: 'Teams',
            type: 'message',
          },
          {
            data: { message: 'from company' },
            title: 'Search',
            category: 'Teams',
            type: 'message',
          },
          {
            data: { message: 'from company' },
            title: <UI.Text opacity={0.5}>25 more</UI.Text>,
            onClick: () => {
              mainStore.colIndex = 0
            },
            category: 'Teams',
            type: 'message',
          },
        ]}
        width={MAIN_WIDTH}
        groupKey="category"
        itemProps={itemProps}
        getItem={getItem(this.props)}
      />
    )
  }
}

type Props = {
  mainStore: BarMainStore,
  paneStore: Class<any>,
}

@view.attach('barStore')
@view({
  mainStore: BarMainStore,
})
export default class BarMain extends React.Component<Props> {
  render({ mainStore, paneStore }: Props) {
    if (!mainStore.results) {
      return null
    }
    const { colIndex } = mainStore
    return (
      <main>
        <column $position={[0, colIndex]}>
          <PrimaryColumn mainStore={mainStore} paneStore={paneStore} />
        </column>
        <column $position={[1, colIndex]}>
          <SecondaryColumn mainStore={mainStore} paneStore={paneStore} />
        </column>
      </main>
    )
  }

  static style = {
    main: {
      flex: 1,
      flexFlow: 'row',
      width: MAIN_WIDTH,
    },
    active: {
      //background: 'red',
    },
    column: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      transition: 'all ease-in 100ms',
    },
    position: ([curIndex, activeIndex]) => {
      return {
        opacity: curIndex === activeIndex ? 1 : 0,
        pointerEvents: curIndex === activeIndex ? 'auto' : 'none',
        transform: {
          x: (curIndex - activeIndex) * MAIN_WIDTH / 10,
        },
      }
    },
  }
}
