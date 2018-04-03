import * as React from 'react'
import { view } from '@mcro/black'
import * as UI from '@mcro/ui'

const TAB_SLANT_X = 7
const BORDER_LEFT_SIZE = 12

const glowProps = {
  color: '#fff',
  scale: 0.7,
  blur: 70,
  opacity: 0.1,
  resist: 20,
  zIndex: 1,
}

const chromeStyle = {
  marginRight: TAB_SLANT_X,
  position: 'absolute',
  top: 0,
  left: -4,
  right: 0,
  bottom: -2,
  zIndex: 0,
  borderTopRadius: BORDER_LEFT_SIZE / 1.75,
  overflow: 'hidden',
  transform: {
    perspective: '100px',
    rotateX: '12deg',
    // this little extra moves the blurry
    // top from perspective up just enough
    // to make the top glint connect nicely
    y: '-4%',
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
        css={{
          position: 'relative',
          flex: 1,
          maxWidth: '100%',
          // borderBottom: [1, [255, 255, 255, 0.15]],
        }}
        onMouseEnter={store.ref('showGlow').setter(true)}
        onMouseLeave={store.ref('showGlow').setter(false)}
      >
        <chrome
          css={{
            ...chromeStyle,
            left: BORDER_LEFT_SIZE / 4,
            borderBottom: 'none',
            boxShadow: ['inset -0.5px 0.5px 0 rgba(255,255,255,0.15)'],
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
              overflow: 'hidden',
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
            sizePadding={0.65}
            sizeHeight={0.8}
            sizeRadius={0.7}
            alpha={0.3}
            alignSelf="center"
            hover={{
              alpha: 0.95,
              background: [30, 30, 30, 0.9],
            }}
            onClick={onBack}
            {...backProps}
          />
          <titles>
            <UI.Title
              if={titleIsString}
              ellipse
              size={1.1}
              fontWeight={500}
              alpha={0.8}
              textShadow="0 -1px 0 rgba(0,0,0,0.2)"
            >
              {title}
            </UI.Title>
            {titleIsElement ? title : null}
            <UI.Title if={subtitle} ellipse size={0.8} alpha={0.35}>
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
      margin: [-3, 5, -3, -6],
      zIndex: 10,
    },
    image: {
      width: 16,
      height: 16,
      borderRadius: 100,
      // border: [1, [255, 255, 255, 0.7]],
      marginLeft: 10,
      marginRight: TAB_SLANT_X,
      alignSelf: 'center',
    },
  }
}
