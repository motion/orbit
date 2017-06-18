// @flow
import { view } from '@jot/black'

const idFn = _ => _
const opposite = direction =>
  ({
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }[direction])

type Props = {
  from: 'top' | 'bottom' | 'left' | 'right',
  size: number,
  onClickOverlay: Function,
  zIndex: number,
  style: Object,
  shadowed?: boolean,
  bordered?: boolean,
  dark?: boolean,
  noOverlay?: boolean,
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
  }

  render({
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
          $overlayBg={{ blur: overlayBlur }}
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
      overflow: 'hidden',
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
      background: '#fff',
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      transition: 'transform ease-in 150ms, opacity ease-in 150ms',
      opacity: 0,
      overflow: 'auto',
    },
    panelOpen: {
      pointerEvents: 'all',
      opacity: 1,
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
    theme: ({ bordered, shadowed }, context, { background }) => ({
      panel: {
        borderLeft: bordered && [1, background],
        boxShadow: shadowed && '0 0 6px rgba(0,0,0,0.3)',
      },
    }),
    noOverlay: {
      overlay: {
        display: 'none',
      },
    },
    zIndex: ({ zIndex }) => ({
      drawer: {
        zIndex,
      },
    }),
  }
}
