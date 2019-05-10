import { Absolute, AbsoluteProps, CSSPropertySet, gloss } from 'gloss'

const Border = gloss<
  AbsoluteProps & {
    light?: boolean
    borderColor?: CSSPropertySet['borderColor']
  }
>(Absolute).theme((p, theme) => ({
  ...p,
  background: p.borderColor || (p.light ? theme.borderColorLight : theme.borderColor),
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
})
