// @flow
import * as React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
import Surface from './surface'

const opposite = direction =>
  ({
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }[direction])

type Props = {
  attach?: Object,
  background?: Color,
  bordered?: boolean,
  children?: React.Element<any> | string,
  className?: string,
  from: 'top' | 'bottom' | 'left' | 'right',
  showOverlay?: boolean,
  onClickOverlay: Function,
  open?: boolean,
  overlayBlur?: number,
  percent?: number | string,
  boxShadow?: boolean | 'string',
  size: number,
  style: Object,
  theme?: string,
  transition?: boolean,
  transitionDuration?: number,
  transparent?: boolean,
  zIndex: number,
  scrollable?: boolean,
  containerProps?: Object,
}

@view.ui
export default class Drawer extends React.PureComponent<Props> {
  static defaultProps = {
    size: 400,
    from: 'left',
    zIndex: 100,
    transitionDuration: 500,
  }

  render({
    transparent,
    transition,
    transitionDuration,
    open,
    children,
    from,
    size,
    percent,
    onClickOverlay,
    showOverlay,
    bordered,
    zIndex,
    className,
    overlayBlur,
    theme,
    scrollable,
    closePortal,
    style,
    containerProps,
    ...props
  }: Props) {
    const unit = +percent ? '%' : 'px'
    const flip = /right|bottom/.test(from) ? 1 : -1
    const translate = `${(open ? 0 : size) * flip}${unit}`
    const sizeKey = /left|right/.test(from) ? 'width' : 'height'
    const panelStyle = {
      transform:
        sizeKey === 'width'
          ? `translate(${translate})`
          : `translate(0px, ${translate})`,
      [sizeKey]: `${size}${unit}`,
    }

    return (
      <drawer $drawerOpen={open} {...containerProps}>
        <Surface
          style={{ ...style, ...panelStyle }}
          $panel
          $from={from}
          $panelOpen={open}
          className={className}
          {...props}
        >
          {children}
        </Surface>
        <overlay
          if={showOverlay}
          $overlayOpen={open}
          $overlayBg={{ blur: overlayBlur === true ? 5 : overlayBlur }}
          onClick={e => {
            e.preventDefault()
            if (onClickOverlay) {
              onClickOverlay(false, e)
            }
          }}
        />
      </drawer>
    )
  }

  static style = {
    drawer: {
      position: 'absolute',
      overflow: 'hidden', // needed to hide drawer when closed
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      opacity: 0,
      pointerEvents: 'none',
      transform: {
        z: 0,
      },
    },
    drawerOpen: {
      opacity: 1,
      zIndex: 100,
    },
    // darken bg much less if blurring
    overlayBg: ({ blur }) =>
      blur
        ? {
            backdropFilter: `blur(${blur}px)`,
            background: 'rgba(0,0,0,0.1)',
          }
        : {
            background: 'rgba(0,0,0,0.25)',
          },
    panel: {
      pointerEvents: 'none',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      transition: 'transform ease-in-out 150ms',
      zIndex: 100,
      maxHeight: '100%',
      maxWidth: '100%',
    },
    panelOpen: {
      pointerEvents: 'all',
      transform: { x: 0, y: 0, z: 0 },
    },
    from: direction => ({
      [direction]: 0,
      [opposite(direction)]: 'auto',
    }),
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      opacity: 0,
      transition: 'all ease-in-out 250ms',
      zIndex: -1,
      pointerEvents: 'none',
    },
    overlayOpen: {
      opacity: 1,
      zIndex: 1,
      pointerEvents: 'all',
    },
  }

  static theme = (props, theme) => {
    return {
      drawer: {
        zIndex: props.zIndex,
      },
      panel: {
        overflowY: props.scrollable ? 'scroll' : 'inherit',
        // transition:
        //   (props.transition && `all ease-in ${props.transitionDuration}`) || '',
        borderColor: (props.bordered && theme.base.borderColor) || '',
      },
    }
  }
}
