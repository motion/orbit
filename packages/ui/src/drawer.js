// @flow
import React from 'react'
import { view } from '@mcro/black'
import type { Color } from '@mcro/gloss'
import Surface from './surface'

const idFn = _ => _
const opposite = direction =>
  ({
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }[direction])

type Props = {
  open?: boolean,
  percent?: number | string,
  attach?: Object,
  children?: React$Element<any>,
  from: 'top' | 'bottom' | 'left' | 'right',
  size: number,
  onClickOverlay: Function,
  zIndex: number,
  style: Object,
  shadowed?: boolean,
  bordered?: boolean,
  noOverlay?: boolean,
  theme?: string,
  className?: string,
  overlayBlur?: number,
  transition: string,
  transparent?: boolean,
  background?: Color,
}

@view.ui
export default class Drawer {
  props: Props

  static defaultProps = {
    size: 400,
    onClickOverlay: idFn,
    from: 'left',
    zIndex: 10000,
    style: {},
    transition: 'ease-in 200ms',
  }

  render({
    transparent,
    transition,
    open,
    children,
    from,
    size,
    percent,
    style,
    onClickOverlay,
    noOverlay,
    shadowed,
    bordered,
    zIndex,
    attach,
    className,
    overlayBlur,
    theme,
    background,
    closePortal,
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
      <drawer {...props}>
        <Surface
          $panel
          $from={from}
          $panelOpen={open}
          $$style={style}
          style={panelStyle}
          className={className}
          {...attach}
        >
          {children}
        </Surface>
        <overlay
          $overlayOpen={open}
          $overlayBg={{ blur: overlayBlur === true ? 5 : overlayBlur }}
          onClick={e => {
            e.preventDefault()
            onClickOverlay(false, e)
          }}
        />
      </drawer>
    )
  }

  static style = {
    drawer: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      pointerEvents: 'none',
      transform: {
        z: 0,
      },
    },
    // darken bg much less if blurring
    overlayBg: ({ blur }) =>
      blur
        ? {
            backdropFilter: `blur(${blur}px)`,
            background: 'rgba(0,0,0,0.01)',
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
      pointerEvents: 'all',
    },
  }

  static theme = {
    theme: (props, theme) => {
      return {
        overlay: {
          display: props.overlay ? 'block' : 'none',
        },
        drawer: {
          zIndex: props.zIndex,
        },
        panel: {
          ...theme.base,
          background: props.transparent
            ? 'transparent'
            : props.background || theme.base.background,
          transition: `transform ${props.transition}`,
          borderColor: props.bordered && theme.base.borderColor,
          boxShadow:
            props.shadowed && (theme.base.shadow || '0 0 6px rgba(0,0,0,0.3)'),
        },
      }
    },
  }
}
