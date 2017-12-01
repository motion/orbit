// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const glowProps = {
  color: '#fff',
  scale: 0.7,
  blur: 70,
  opacity: 0.04,
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
    rotateX: '6deg',
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
            background: Constants.ORA_BG_MAIN,
            borderBottom: 'none',
            boxShadow: [
              'inset 0 0.5px 0 rgba(255,255,255,0.15)',
              '0 0 20px 0 rgba(0,0,0,0.5)',
            ],
          }}
        />
        <inner
          css={{
            padding: [6, 12],
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
    const titleIsString = typeof title === 'string'
    const titleIsElement = React.isValidElement(title)
    return (
      <sidebartitle onClick={e => e.stopPropagation()}>
        <UI.Button
          if={!!onBack && !noBack}
          $backButton
          chromeless
          size={0.9}
          icon="arrominleft"
          boxShadow="0 0 10px rgba(0,0,0,0.1)"
          onClick={onBack}
          {...backProps}
        />
        <Tab>
          <titles>
            <UI.Title
              if={titleIsString}
              ellipse={2}
              size={1}
              fontWeight={300}
              opacity={0.7}
              textShadow="0 -1px 0 rgba(0,0,0,0.2)"
            >
              {title}
            </UI.Title>
            {titleIsElement ? title : null}
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
      padding: [0, 3.5, 0, 3],
      userSelect: 'none',
      // borderBottom: [1, [255, 255, 255, 0.05]],
      // background: [255, 255, 255, 0.05],
    },
    titles: {
      flex: 1,
      width: '50%',
      justifyContent: 'flex-start',
      paddingRight: 10,
      flexFlow: 'row',
    },
    backButton: {
      margin: [0, 3, 0, -3],
    },
    image: {
      width: 16,
      height: 16,
      borderRadius: 100,
      // border: [1, [255, 255, 255, 0.7]],
      marginLeft: 10,
      alignSelf: 'center',
    },
  }
}
