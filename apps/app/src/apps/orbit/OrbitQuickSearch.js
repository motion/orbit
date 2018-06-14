import * as React from 'react'
import { view } from '@mcro/black'
// import { App } from '@mcro/all'
import { OrbitIcon } from './orbitIcon'

const iconSize = 42
const iconPad = 15
const pad = 0

@view
class OrbitQuickItem {
  render({ item, appStore, index }) {
    const active = appStore.quickSearchIndex === index
    return (
      <quickItem $active={active}>
        <OrbitIcon icon={`/icons/${item.icon}`} size={iconSize} />
        <description if={active}>
          <main $ellipse>{item.title}</main>
          <secondary $ellipse>{item.id}</secondary>
        </description>
      </quickItem>
    )
  }

  static style = {
    quickItem: {
      flexFlow: 'row',
      padding: iconPad,
      '&:hover': {
        background: [0, 0, 0, 0.025],
      },
      '&:active': {
        background: [0, 0, 0, 0.035],
      },
    },
    active: {
      background: [0, 0, 0, 0.03],
      width: 200,
      overflow: 'hidden',
    },
    description: {
      flex: 1,
      overflow: 'hidden',
      padding: [0, 10],
    },
    secondary: {
      opacity: 0.3,
    },
    ellipse: {
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
  }
}

@view.attach('appStore')
@view
export class OrbitQuickSearch {
  render({ appStore }) {
    return (
      <quickSearch>
        {appStore.quickSearchResults.map((item, index) => (
          <OrbitQuickItem
            key={`${item.id}${index}`}
            item={item}
            appStore={appStore}
            index={index}
          />
        ))}
      </quickSearch>
    )
  }
  static style = {
    quickSearch: {
      pointerEvents: 'all',
      flexFlow: 'row',
      paddingLeft: pad,
      height: iconSize + pad * 2 + iconPad * 2,
      alignItems: 'center',
    },
  }
}
