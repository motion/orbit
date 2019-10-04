// passing through here because... in playground if you use UI kit without setting Config.toColor
// in @o/ui, then in alphaColorTheme it will fail on setAlpha
export const colorToString = (obj: any) => {
  if (obj.cssVariable) {
    if (obj.cssUseRgb) {
      if (obj.cssUseAlpha) {
        return `rgba(var(--${obj.cssVariable}-rgb), ${obj.alpha})`
      } else {
        return `rgba(var(--${obj.cssVariable}))`
      }
    } else {
      return `var(--${obj.cssVariable})`
    }
  }
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
    const inner = `${color[0]}, ${Math.round(color[1])}%, ${Math.round(color[2])}%`
    if (hasAlpha) {
      return `hsla(${inner}, ${valpha})`
    }
    return `hsl(${inner})`
  }
  return obj.toString()
}
