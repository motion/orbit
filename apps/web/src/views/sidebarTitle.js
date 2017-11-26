// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const Tab = ({ children }) => {
  return (
    <tab css={{ position: 'relative', flex: 1 }}>
      <chrome
        css={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          borderTopRadius: 6,
          background: [70, 70, 70, 0.6],
          // background:
          //   'linear-gradient(rgba(70, 70, 70,0.6), rgba(70, 70, 70,0.5))',
          boxShadow: 'inset 0 0.5px 0 rgba(255,255,255,0.1)',
          transform: {
            perspective: '100px',
            rotateX: '10deg',
          },
        }}
      />
      <inner css={{ padding: [8, 12], flexFlow: 'row', flex: 1 }}>
        {children}
      </inner>
    </tab>
  )
}

@view
export default class SidebarTitle {
  render({ image, backProps, noBack, icon, subtitle, title, onBack }) {
    return (
      <sidebartitle onClick={e => e.stopPropagation()}>
        <UI.Button
          if={false && !noBack}
          $backButton
          size={0.9}
          circular
          theme="light"
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
          onClick={onBack}
          {...backProps}
        />
        <Tab>
          <titles>
            <UI.Title ellipse={2} size={1.1} fontWeight={500}>
              {title}
            </UI.Title>
            <UI.Title if={subtitle} ellipse size={0.8} opacity={0.5}>
              {subtitle}
            </UI.Title>
          </titles>
          <img if={image} $image src={image} />
          <UI.Icon if={icon} $image name={icon || '/images/me.jpg'} />
        </Tab>
      </sidebartitle>
    )
  }

  static style = {
    image: {
      width: 24,
      height: 24,
      borderRadius: 100,
      border: [1, [255, 255, 255, 0.7]],
      marginLeft: 10,
      alignSelf: 'center',
    },
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      overflow: 'hidden',
      padding: [5, 10, 0],
      borderBottom: [1, [255, 255, 255, 0.05]],
      // background: [255, 255, 255, 0.05],
    },
    titles: {
      flex: 1,
      width: '50%',
    },
    backButton: {
      margin: [0, 8, 0, -3],
    },
  }
}
