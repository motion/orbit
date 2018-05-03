import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

class HeaderStore {
  height = 0

  willMount() {
    this.height = this.props.subtitle ? 85 : 50
    this.props.peekStore.headerHeight = this.height
  }
}

@view.attach('peekStore')
@view({
  store: HeaderStore,
})
export default class PeekHeader extends React.Component {
  render({ store, peekStore, title, date, subtitle, after }) {
    return (
      <header css={{ height: store.height }}>
        <title if={title}>
          <chromeSpace if={peekStore.hasHistory} />
          <titles>
            <UI.Title $titleMain size={1.3} fontWeight={700}>
              {title}
            </UI.Title>
            <UI.Title if={subtitle} size={1} $subtitle>
              {subtitle} <UI.Date>{date}</UI.Date>
            </UI.Title>
          </titles>
        </title>
        <after if={after}>{after}</after>
      </header>
    )
  }

  static style = {
    header: {
      flexFlow: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      zIndex: 100,
      borderBottom: [1, [0, 0, 0, 0.05]],
      padding: [15, 0, 14],
      margin: [0, 15],
    },
    chromeSpace: {
      // width: 30,
    },
    icon: {
      padding: [0, 5, 0, 18],
    },
    title: {
      flex: 1,
      overflow: 'hidden',
      flexFlow: 'row',
    },
    titleMain: {
      flex: 1,
      marginBottom: 5,
    },
    subtitle: {
      opacity: 0.8,
    },
    date: { opacity: 0.5, fontSize: 14 },
    orbitInput: {
      width: '100%',
      // background: 'red',
    },
  }
}
