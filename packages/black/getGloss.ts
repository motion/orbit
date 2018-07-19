import Gloss from '@mcro/gloss'

let gloss

export function getGloss() {
  console.trace()
  if (!gloss) {
    gloss = new Gloss({
      glossProp: 'css',
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
          const inner = `${color[0]}, ${Math.round(color[1])}%, ${Math.round(
            color[2],
          )}%`
          if (hasAlpha) {
            return `hsla(${inner}, ${valpha})`
          }
          return `hsl(${inner})`
        }
        return obj.toString()
      },
    })
  }
  return gloss
}

// export const { decorator, createElement } = gloss
// export default gloss
