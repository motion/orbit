//!
import { Absolute, AbsoluteProps, CSSPropertySet, gloss, ThemeFn } from 'gloss'

type BorderProps = AbsoluteProps & {
  borderColor?: CSSPropertySet['borderColor']
  borderColorHover?: CSSPropertySet['borderColor']
  hoverable?: boolean
}

const borderTheme: ThemeFn = props => {
  return {
    background: props.borderColor,
    hoverable: {
      hoverStyle: {
        background: props.backgroundStronger,
      },
    },
  }
}

export const BorderTop = gloss<BorderProps>(Absolute, {
  className: 'ui-border-top',
  height: 1,
  zIndex: 100000,
  top: 0,
  left: 0,
  right: 0,
  transform: {
    y: -0.5,
  },
}).theme(borderTheme)

export const BorderBottom = gloss<BorderProps>(Absolute, {
  className: 'ui-border-bottom',
  height: 1,
  zIndex: 100000,
  bottom: 0,
  left: 0,
  right: 0,
  transform: {
    y: 0.5,
  },
}).theme(borderTheme)

export const BorderLeft = gloss<BorderProps>(Absolute, {
  className: 'ui-border-left',
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  left: 0,
  transform: {
    x: -0.5,
  },
}).theme(borderTheme)

export const BorderRight = gloss<BorderProps>(Absolute, {
  className: 'ui-border-right',
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  right: 0,
  transform: {
    x: 0.5,
  },
}).theme(borderTheme)
