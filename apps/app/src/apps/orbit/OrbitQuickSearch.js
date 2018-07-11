import * as React from 'react'
import { view, attachTheme } from '@mcro/black'
// import { App } from '@mcro/stores'
import { OrbitIcon } from './orbitIcon'

const iconSize = 38
const iconPad = 15
const pad = 0

@attachTheme
@view
class OrbitQuickItem extends React.Component {
  render({ item, appStore, index }) {
    const active =
      appStore.quickSearchIndex === index && appStore.activeIndex === -1
    return (
      <quickItem $active={active} $inactive={!active}>
        <OrbitIcon icon={`/icons/${item.icon}`} size={iconSize} />
        <description>
          <main $ellipse>{item.title}</main>
          <secondary $ellipse>{item.id}</secondary>
        </description>
      </quickItem>
    )
  }

  static style = {
    quickItem: {
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
    },
    inactive: {
      opacity: 0.3,
      // filter: 'grayscale(100%)',
    },
    description: {
      margin: ['auto', 0],
      flex: 1,
      overflow: 'hidden',
      padding: [0, 10],
    },
    main: {
      fontSize: 16,
      fontWeight: 500,
    },
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
  }

  static theme = ({ theme }) => {
    return {
      active: {
        background: theme.hover.background,
      },
    }
  }
}

@attachTheme
@view.attach('appStore')
@view
export class OrbitQuickSearch extends React.Component {
  render({ appStore }) {
    console.log('quick search it up', appStore.quickSearchResults)
    return (
      <div $quickSearch>
        {appStore.quickSearchResults.map((item, index) => (
          <OrbitQuickItem
            key={`${item.id}${index}`}
            item={item}
            appStore={appStore}
            index={index}
          />
        ))}
      </div>
    )
  }
  static style = {
    quickSearch: {
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
    },
  }

  static theme = ({ theme }) => {
    return {
      borderBottom: [1, theme.hover.background],
    }
  }
}
