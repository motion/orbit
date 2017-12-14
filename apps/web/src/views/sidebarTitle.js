// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'
import * as Constants from '~/constants'

const glowProps = {
  color: '#fff',
  scale: 0.7,
  blur: 70,
  opacity: 0.05,
  resist: 20,
  zIndex: 1,
}

const TAB_SLANT_X = 4.5

const chromeStyle = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: -1,
  zIndex: 0,
  borderTopRadius: 6,
  overflow: 'hidden',
  transform: {
    perspective: '100px',
    rotateX: '8deg',
    y: -1,
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
        css={{ position: 'relative', flex: 1, overflow: 'hidden' }}
        onMouseEnter={store.ref('showGlow').setter(true)}
        onMouseLeave={store.ref('showGlow').setter(false)}
      >
        <leftBorder
          css={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            right: TAB_SLANT_X + 10,
            background: Constants.ORA_BG_MAIN,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 0,
            zIndex: 2,
            boxShadow: ['inset 0 0.5px 0 rgba(255,255,255,0.1)'],
          }}
        />
        <chrome
          css={{
            ...chromeStyle,
            marginRight: TAB_SLANT_X,
            background: Constants.ORA_BG_MAIN,
            borderBottom: 'none',
            boxShadow: [
              'inset 0 0.5px 0 rgba(255,255,255,0.2)',
              '0 0 15px 0 rgba(0,0,0,0.3)',
            ],
          }}
        />
        <inner
          css={{
            padding: [7, 12],
            position: 'relative',
            width: 'auto',
            flexFlow: 'row',
            zIndex: 3,
            alignItems: 'center',
          }}
        >
          {children}
          <hoverContain
            css={{
              ...chromeStyle,
            }}
          >
            <UI.HoverGlow {...glowProps} show={store.showGlow} />
          </hoverContain>
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
        <Tab>
          <UI.Button
            if={!!onBack && !noBack}
            $backButton
            chromeless
            size={1.1}
            icon="arrominleft"
            sizePadding={0.85}
            sizeHeight={0.85}
            alpha={0.3}
            alignSelf="center"
            hover={{
              alpha: 0.5,
              background: [0, 0, 0, 0.1],
            }}
            onClick={onBack}
            {...backProps}
          />
          <titles>
            <UI.Title
              if={titleIsString}
              ellipse
              size={1.1}
              fontWeight={300}
              opacity={0.6}
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
      userSelect: 'none',
      // borderBottom: [1, [255, 255, 255, 0.05]],
      // background: [255, 255, 255, 0.05],
    },
    titles: {
      flex: 1,
      width: '50%',
      justifyContent: 'flex-start',
      alignItems: 'flex-start',
      paddingRight: 8,
    },
    backButton: {
      margin: [-3, 5, -3, -8],
      zIndex: 10,
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
