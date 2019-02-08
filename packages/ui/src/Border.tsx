import { Absolute, gloss } from '@mcro/gloss'

const Border = gloss(Absolute).theme((p, theme) => ({
  background: p.borderColor || theme.borderColor,
}))

export const BorderTop = gloss(Border, {
  height: 1,
  zIndex: 100000000,
  top: 0,
  left: 0,
  right: 0,
  transform: {
    y: -0.5,
  },
})

export const BorderBottom = gloss(Border, {
  height: 1,
  zIndex: 100000000,
  bottom: 0,
  left: 0,
  right: 0,
  transform: {
    y: 0.5,
  },
})

export const BorderLeft = gloss(Border, {
  width: 1,
  zIndex: 100000000,
  top: 0,
  bottom: 0,
  left: 0,
  transform: {
    x: -0.5,
  },
})

export const BorderRight = gloss(Border, {
  width: 1,
  zIndex: 100000000,
  top: 0,
  bottom: 0,
  right: 0,
  transform: {
    x: 0.5,
  },
})
