export const colorToString = (obj: any) => {
  // passing through here because... in playground if you use UI kit without setting Config.toColor
  // in @o/ui, then in alphaColorTheme it will fail on setAlpha
  if (obj.getCSSValue) {
    return obj
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
