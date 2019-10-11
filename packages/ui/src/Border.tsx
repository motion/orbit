import { Absolute, AbsoluteProps, CSSPropertySet, gloss, ThemeFn } from 'gloss'

//!
type BorderProps = AbsoluteProps & {
  borderColor?: CSSPropertySet['borderColor']
  borderColorHover?: CSSPropertySet['borderColor']
  hoverable?: boolean
}

// best i can think to compile down to:
// const BorderTop = props => (
//   <div className={useThemeProps(props)}>
//     <div className="123 123" />
//   </div>
// )

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
  height: 1,
  zIndex: 100000,
  top: 0,
  left: 0,
  right: 0,
  transform: {
    y: -0.5,
  },
})
  .theme(borderTheme)
  .withConfig({
    defaultProps: {
      className: 'ui-border-top',
    },
  })

export const BorderBottom = gloss<BorderProps>(Absolute, {
  height: 1,
  zIndex: 100000,
  bottom: 0,
  left: 0,
  right: 0,
  transform: {
    y: 0.5,
  },
})
  .theme(borderTheme)
  .withConfig({
    defaultProps: {
      className: 'ui-border-bottom',
    },
  })

export const BorderLeft = gloss<BorderProps>(Absolute, {
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  left: 0,
  transform: {
    x: -0.5,
  },
})
  .theme(borderTheme)
  .withConfig({
    defaultProps: {
      className: 'ui-border-left',
    },
  })

export const BorderRight = gloss<BorderProps>(Absolute, {
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  right: 0,
  transform: {
    x: 0.5,
  },
})
  .theme(borderTheme)
  .withConfig({
    defaultProps: {
      className: 'ui-border-right',
    },
  })
