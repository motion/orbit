// @flow
import { view } from '@jot/black'
import type { Color } from 'gloss'

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
  percent?: number,
  attach?: Object,
  children?: React$Element<any>,
  from: 'top' | 'bottom' | 'left' | 'right',
  size: number,
  onClickOverlay: Function,
  zIndex: number,
  style: Object,
  shadowed?: boolean,
  bordered?: boolean,
  dark?: boolean,
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
    dark,
    shadowed,
    bordered,
    zIndex,
    attach,
    className,
    overlayBlur,
    theme,
    background,
    ...props
  }: Props) {
    const unit = percent ? '%' : 'px'
    const flip = /right|bottom/.test(from) ? 1 : -1
    const translate = `${(open ? 0 : size) * flip}${unit}`
    const sizeKey = /left|right/.test(from) ? 'width' : 'height'
    const panelStyle = {
      transform: sizeKey === 'width'
        ? `translate(${translate})`
        : `translate(0px, ${translate})`,
      [sizeKey]: `${size}${unit}`,
    }

    return (
      <drawer {...props}>
        <panel
          $from={from}
          $panelOpen={open}
          $$style={style}
          style={panelStyle}
          className={className}
          {...attach}
        >
          {children}
        </panel>
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
      display: 'none',
    },
    overlayOpen: {
      opacity: 1,
      pointerEvents: 'all',
    },
  }

  static theme = {
    theme: (
      { transparent, background, transition, bordered, shadowed },
      _,
      theme
    ) => {
      return {
        panel: {
          ...theme.base,
          background: transparent
            ? 'transparent'
            : background || theme.base.background,
          transition: `transform ${transition}`,
          borderColor: bordered && theme.base.borderColor,
          boxShadow:
            shadowed && (theme.base.shadow || '0 0 6px rgba(0,0,0,0.3)'),
        },
      }
    },
    overlay: {
      overlay: {
        display: 'block',
      },
    },
    zIndex: ({ zIndex }) => ({
      drawer: {
        zIndex,
      },
    }),
  }
}
