import { Absolute, AbsoluteProps, CSSPropertySet, gloss } from 'gloss'

const Border = gloss<
  AbsoluteProps & {
    borderColor?: CSSPropertySet['borderColor']
  }
>(Absolute).theme((p, theme) => ({
  ...p,
  background: p.borderColor ? p.borderColor.toString() : theme.borderColor,
}))

export const BorderTop = gloss(Border, {
  height: 1,
  zIndex: 100000,
  top: 0,
  left: 0,
  right: 0,
  transform: {
    y: -0.5,
  },
}).withConfig({
  defaultProps: {
    className: 'ui-border-top',
  },
})

export const BorderBottom = gloss(Border, {
  height: 1,
  zIndex: 100000,
  bottom: 0,
  left: 0,
  right: 0,
  transform: {
    y: 0.5,
  },
}).withConfig({
  defaultProps: {
    className: 'ui-border-bottom',
  },
})

export const BorderLeft = gloss(Border, {
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  left: 0,
  transform: {
    x: -0.5,
  },
}).withConfig({
  defaultProps: {
    className: 'ui-border-left',
  },
})

export const BorderRight = gloss(Border, {
  width: 1,
  zIndex: 100000,
  top: 0,
  bottom: 0,
  right: 0,
  transform: {
    x: 0.5,
  },
}).withConfig({
  defaultProps: {
    className: 'ui-border-right',
  },
})
