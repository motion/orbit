// @flow
import gloss from '@mcro/gloss'
import baseStyles from './baseStyles'

export type Glossy = {
  glossElement(
    tagName: string,
    props: ?Object,
    children: ?any
  ): React$Element<any>,
}

const Gloss = gloss({
  baseStyles,
  glossProp: 'css',
  themeProp: 'theme',
  tagName: 'tagName',
  isColor: color => color && !!color.rgb,
  toColor: obj => {
    const { model, color, valpha } = obj
    const hasAlpha = typeof valpha === 'number' && valpha !== 1
    if (model === 'rgb') {
      const inner = `${color[0]}, ${color[1]}, ${color[2]}`
      if (hasAlpha) {
        return `rgba(${inner}, ${valpha})`
      }
      return `rgb(${inner})`
    }
    if (model === 'hsl') {
      const inner = `${color[0]}, ${Math.round(color[1], 4)}%, ${Math.round(
        color[2],
        4
      )}%`
      if (hasAlpha) {
        return `hsla(${inner}, ${valpha})`
      }
      return `hsl(${inner})`
    }
    return obj.toString()
  },
})

window.Gloss = Gloss

export const { decorator, createElement } = Gloss
