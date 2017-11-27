// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const glowProps = {
  color: '#fff',
  scale: 0.5,
  blur: 70,
  opacity: 0.03,
  resist: 20,
  zIndex: 1,
}

const chromeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 0,
  borderTopRadius: 6,
  overflow: 'hidden',
  transform: {
    perspective: '100px',
    rotateX: '10deg',
  },
}

@view({
  store: class TabStore {
    showGlow = false
  },
})
class Tab {
  render({ store, children }) {
    return (
      <tab
        css={{ position: 'relative', flex: 1 }}
        onMouseEnter={store.ref('showGlow').setter(true)}
        onMouseLeave={store.ref('showGlow').setter(false)}
      >
        <chrome
          css={{
            ...chromeStyle,
            background: [40, 40, 40, 0.98],
            borderBottom: 'none',
            boxShadow: [
              'inset 0 0.5px 0 rgba(255,255,255,0.15)',
              '0 0 7px 0 rgba(0,0,0,0.5)',
            ],
          }}
        />
        <inner
          css={{
            padding: [8, 12],
            flexFlow: 'row',
            flex: 1,
            zIndex: 1,
          }}
        >
          {children}
          <chromeAbove
            css={{ ...chromeStyle, background: 'transparent', zIndex: 1 }}
          >
            <UI.HoverGlow {...glowProps} show={store.showGlow} />
          </chromeAbove>
        </inner>
      </tab>
    )
  }
}

@view
export default class SidebarTitle {
  render({ after, image, backProps, noBack, icon, subtitle, title, onBack }) {
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
          {after}
          <img if={image} $image src={image} />
          <UI.Icon if={icon} $image name={icon || '/images/me.jpg'} />
        </Tab>
      </sidebartitle>
    )
  }

  static style = {
    sidebartitle: {
      flexFlow: 'row',
      alignItems: 'center',
      padding: [0, 5, 0],
      userSelect: 'none',
      // borderBottom: [1, [255, 255, 255, 0.05]],
      // background: [255, 255, 255, 0.05],
    },
    titles: {
      flex: 1,
      width: '50%',
    },
    backButton: {
      margin: [0, 8, 0, -3],
    },
    image: {
      width: 24,
      height: 24,
      borderRadius: 100,
      // border: [1, [255, 255, 255, 0.7]],
      marginLeft: 10,
      alignSelf: 'center',
    },
  }
}
