import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
// import { App } from '@mcro/stores'
import { OrbitIcon } from './OrbitIcon'
import { AppStore } from '../../stores/AppStore'

const iconSize = 38
const iconPad = 15
const pad = 0

const QuickItem = view({
  width: 240,
  flexFlow: 'row',
  overflow: 'hidden',
  padding: iconPad,
  '&:hover': {
    background: [0, 0, 0, 0.025],
  },
  '&:active': {
    background: [0, 0, 0, 0.035],
  },
  inactive: {
    opacity: 0.3,
    // filter: 'grayscale(100%)',
  },
})

const Description = view({
  margin: ['auto', 0],
  flex: 1,
  overflow: 'hidden',
  padding: [0, 10],
})

const Main = view({
  fontSize: 16,
  fontWeight: 500,
  secondary: {
    opacity: 0.3,
    fontSize: 12,
  },
  ellipse: {
    display: 'block',
    width: '100%',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
})

@attachTheme
@view
class OrbitQuickItem extends React.Component {
  render() {
    const { item, appStore, index } = this.props
    const active =
      appStore.quickSearchIndex === index && appStore.activeIndex === -1
    return (
      <QuickItem active={active} inactive={!active}>
        <OrbitIcon icon={`/icons/${item.icon}`} size={iconSize} />
        <Description>
          <Main ellipse>{item.title}</Main>
          <Main secondary ellipse>
            {item.id}
          </Main>
        </Description>
      </QuickItem>
    )
  }
}

const QuickSearch = view({
  // pointerEvents: 'all',
  flexFlow: 'row',
  paddingLeft: pad,
  height: iconSize + pad * 2 + iconPad * 2,
  alignItems: 'center',
  width: '100%',
  overflowX: 'scroll',
  position: 'relative',
  zIndex: 10,
  // undo pane
  margin: [0, -14],
})

@attachTheme
@view.attach('appStore')
@view
export class OrbitQuickSearch extends React.Component<{
  appStore: AppStore
}> {
  render() {
    const { appStore } = this.props
    console.log('quick search it up', appStore.quickSearchResults)
    return (
      <QuickSearch>
        {appStore.quickSearchResults.map((item, index) => (
          <OrbitQuickItem
            key={`${item.id}${index}`}
            item={item}
            appStore={appStore}
            index={index}
          />
        ))}
      </QuickSearch>
    )
  }
}
