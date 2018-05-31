import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

@view.attach('peekStore')
@view
export class PeekHeader extends React.Component {
  onHeader = ref => {
    if (!ref) return
    this.props.peekStore.setHeaderHeight(ref.clientHeight)
  }

  render({ peekStore, title, date, subtitle, after }) {
    return (
      <header ref={this.onHeader}>
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
