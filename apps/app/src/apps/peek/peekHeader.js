import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import { OrbitIcon } from '../../apps/orbit/orbitIcon'

@view.attach('peekStore')
@view
export class PeekHeader extends React.Component {
  onHeader = ref => {
    if (!ref) return
    console.log('setting client height', ref.clientHeight)
    setTimeout(() => {
      this.props.peekStore.setHeaderHeight(ref.clientHeight)
    })
  }

  render({ peekStore, title, date, subtitle, after, permalink, icon }) {
    return (
      <header ref={this.onHeader}>
        <OrbitIcon
          if={icon}
          icon={icon}
          size={16}
          css={{
            position: 'absolute',
            top: -2,
            right: 70,
            transform: {
              scale: 3,
              rotate: '45deg',
            },
          }}
        />
        <title if={title}>
          <chromeSpace if={peekStore.hasHistory} />
          <titles>
            <UI.Title
              $titleMain
              size={1.3}
              fontWeight={700}
              ellipse={2}
              margin={0}
              lineHeight="1.5rem"
            >
              {title}
            </UI.Title>
            <UI.Title if={subtitle} size={1} ellipse={1} $subtitle>
              {subtitle} <UI.Date>{date}</UI.Date>
            </UI.Title>
          </titles>
        </title>
        <after>
          <afterInner>
            <permalink if={permalink}>
              <UI.Button size={0.9} icon="link" circular onClick={permalink} />
            </permalink>
            <space if={permalink && icon} />
          </afterInner>
          {after}
        </after>
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
      // borderBottom: [1, [0, 0, 0, 0.025]],
      padding: 15,
    },
    titles: {
      marginRight: 25,
    },
    chromeSpace: {
      // width: 30,
    },
    title: {
      flex: 1,
      flexFlow: 'row',
    },
    titleMain: {
      flex: 1,
      maxWidth: '100%',
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
    after: {
      alignSelf: 'flex-end',
    },
    afterInner: {
      flexFlow: 'row',
      alignItems: 'center',
      position: 'relative',
    },
    space: {
      width: 7,
    },
    permalink: {
      opacity: 0.5,
    },
  }
}
