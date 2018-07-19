import * as React from 'react'
import { view } from '@mcro/black'
import { Surface } from './Surface'
import { Color } from '@mcro/css'

const opposite = direction =>
  ({
    left: 'right',
    right: 'left',
    bottom: 'top',
    top: 'bottom',
  }[direction])

type Props = {
  attach?: Object
  background?: Color
  bordered?: boolean
  children?: any
  className?: string
  from: 'top' | 'bottom' | 'left' | 'right'
  onClickOverlay: Function
  open?: boolean
  overlayBlur?: number
  percent?: number | string
  boxShadow?: boolean | 'string'
  size: number
  style: Object
  theme?: string
  transition?: boolean
  transitionDuration?: number
  transparent?: boolean
  zIndex: number
  scrollable?: boolean
  containerProps?: Object
  overlayBackground?: boolean
}

@view.ui
export class Drawer extends React.PureComponent<Props> {
  static defaultProps = {
    size: 400,
    from: 'left',
    zIndex: 100,
    transitionDuration: 500,
  }

  render() {
    const {
      open,
      children,
      from,
      size,
      percent,
      onClickOverlay,
      className,
      overlayBlur,
      style,
      overlayBackground,
      containerProps,
      ...props
    } = this.props
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
          $withShadow={!!props.boxShadow && sizeKey}
          $panelOpen={open}
          className={className}
          {...props}
        >
          {children}
        </Surface>
        <div
          if={overlayBackground}
          $overlay
          $overlayOpen={open}
          $overlayBlur={overlayBlur}
          $overlayBackground={overlayBackground}
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

  // style = {
  //   drawer: {
  //     position: 'absolute',
  //     overflow: 'hidden', // needed to hide drawer when closed
  //     top: 0,
  //     right: 0,
  //     bottom: 0,
  //     left: 0,
  //     opacity: 0,
  //     pointerEvents: 'none',
  //     transition: 'opacity ease-out 150ms',
  //   },
  //   drawerOpen: {
  //     opacity: 1,
  //     zIndex: 100,
  //   },
  //   overlayBackground: val => ({
  //     background: val === true ? [0, 0, 0, 0.3] : val,
  //   }),
  //   // darken bg much less if blurring
  //   overlayBlur: blur => ({
  //     backdropFilter: `blur(${blur === true ? 5 : blur}px)`,
  //   }),
  //   panel: {
  //     pointerEvents: 'none',
  //     position: 'absolute',
  //     top: 0,
  //     bottom: 0,
  //     left: 0,
  //     right: 0,
  //     transition: 'transform ease-in-out 150ms',
  //     zIndex: 100,
  //     maxHeight: '100%',
  //   },
  //   panelOpen: {
  //     pointerEvents: 'all',
  //     transform: { x: 0, y: 0, z: 0 },
  //   },
  //   from: direction => ({
  //     [direction]: 0,
  //     [opposite(direction)]: 'auto',
  //   }),
  //   // for nicer shadows, they will go "offscreen" a bit
  //   // which avoids showing the edges of it onscreen
  //   // withShadow: dimension =>
  //   //   dimension === 'height'
  //   //     ? {
  //   //         margin: [0, -100],
  //   //         padding: [0, 100],
  //   //       }
  //   //     : {
  //   //         margin: [-100, 0],
  //   //         padding: [100, 0],
  //   //       },
  //   overlay: {
  //     position: 'absolute',
  //     top: 0,
  //     left: 0,
  //     right: 0,
  //     bottom: 0,
  //     opacity: 0,
  //     transition: 'all ease-in-out 250ms',
  //     zIndex: -1,
  //     pointerEvents: 'none',
  //   },
  //   overlayOpen: {
  //     opacity: 1,
  //     zIndex: 1,
  //     pointerEvents: 'all',
  //   },
  // }

  // static theme = ({ theme, ...props }) => {
  //   return {
  //     drawer: {
  //       zIndex: props.zIndex,
  //     },
  //     panel: {
  //       overflowY: props.scrollable ? 'scroll' : 'inherit',
  //       // transition:
  //       //   (props.transition && `all ease-in ${props.transitionDuration}`) || '',
  //       borderColor: (props.bordered && theme.base.borderColor) || '',
  //     },
  //   }
  // }
}
