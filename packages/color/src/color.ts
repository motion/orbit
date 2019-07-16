import { colorConvert } from './colorConvert'
import { colorString, toHex, toRgbPercent } from './colorString'

// exports

export { colorNames } from './colorNames'
export * from './invertLightness'
export { isColorLike, toColorString } from './isColor'
export * from './linearGradient'
export { ColorArray, ColorLike } from './types'

export function toColor(obj) {
  return new Color(obj)
}

const slice = [].slice
const skippedModels = [
  // to be honest, I don't really feel like keyword belongs in color convert, but eh.
  'keyword',
  // gray conflicts with some method names, and has its own method defined.
  'gray',
  // shouldn't really be in color-convert either...
  'hex',
]

var hashedModelKeys = {}
Object.keys(colorConvert).forEach(function(model) {
  hashedModelKeys[
    slice
      .call(colorConvert[model].labels)
      .sort()
      .join('')
  ] = model
})

const StringCache = new WeakMap()

const cached = new WeakMap()

var limiters = {}

export class Color {
  static rgb: Function

  model = 'rgb'
  color = [0, 0, 0]
  valpha = 1

  rgb: Function
  hsl: Function
  hwb: Function

  constructor(obj, model?) {
    if (model && model in skippedModels) {
      model = null
    }
    if (model && !(model in colorConvert)) {
      throw new Error('Unknown model: ' + model)
    }
    var i
    var channels
    if (!obj) {
      throw new Error('Error, empty value for color')
    }
    if (obj instanceof Color) {
      this.model = obj.model
      this.color = obj.color.slice()
      this.valpha = obj.valpha
    } else if (typeof obj === 'string') {
      var result = colorString.get(obj)
      if (result === null) {
        throw new Error('Unable to parse color from string: ' + obj)
      }
      this.model = result.model
      channels = colorConvert[this.model].channels
      this.color = result.value.slice(0, channels)
      this.valpha = typeof result.value[channels] === 'number' ? result.value[channels] : 1
    } else if (obj.length) {
      this.model = model || 'rgb'
      channels = colorConvert[this.model].channels
      var newArr = slice.call(obj, 0, channels)
      this.color = zeroArray(newArr, channels)
      this.valpha = typeof obj[channels] === 'number' ? obj[channels] : 1
    } else if (typeof obj === 'number') {
      // this is always RGB - can be converted later on.
      obj &= 0xffffff
      this.model = 'rgb'
      this.color = [(obj >> 16) & 0xff, (obj >> 8) & 0xff, obj & 0xff]
      this.valpha = 1
    } else {
      this.valpha = 1
      var keys = Object.keys(obj)
      if ('alpha' in obj) {
        keys.splice(keys.indexOf('alpha'), 1)
        this.valpha = typeof obj.alpha === 'number' ? obj.alpha : 0
      }
      var hashedKeys = keys.sort().join('')
      if (!(hashedKeys in hashedModelKeys)) {
        throw new Error('Unable to parse color from object: ' + JSON.stringify(obj))
      }
      this.model = hashedModelKeys[hashedKeys]
      var labels = colorConvert[this.model].labels
      var color = []
      for (i = 0; i < labels.length; i++) {
        color.push(obj[labels[i]])
      }
      this.color = zeroArray(color, color.length)
    }

    if (process.env.NODE_ENV === 'development' && this.color && this.color.some(x => isNaN(x))) {
      debugger
    }

    // perform limitations (clamping, etc.)
    if (limiters[this.model]) {
      channels = colorConvert[this.model].channels
      for (i = 0; i < channels; i++) {
        var limit = limiters[this.model][i]
        if (limit) {
          this.color[i] = limit(this.color[i])
        }
      }
    }

    this.valpha = Math.max(0, Math.min(1, this.valpha))

    if (Object.freeze) {
      Object.freeze(this)
    }
  }

  toCSS = () => {
    if (cached.has(this)) {
      return cached.get(this)
    }
    const { color, valpha } = this.rgb()
    const [r, g, b] = color
    const next =
      typeof this.valpha === 'number' && valpha !== 1
        ? `rgba(${r}, ${g}, ${b}, ${valpha})`
        : `rgb(${r}, ${g}, ${b})`
    cached.set(this, next)
    return next
  }

  get _equalityKey() {
    return this.toString()
  }

  rgbaObject() {
    return {
      ...this.unitObject(),
      a: this.valpha,
    }
  }

  toString() {
    return this.toCSS()
  }

  string(places?) {
    if (StringCache.get(this)) {
      return StringCache.get(this)
    }
    var self = this.model in colorString.to ? this : this.rgb()
    self = self.round(typeof places === 'number' ? places : 1)
    var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha)
    const val = colorString.to[self.model](args)
    StringCache.set(this, val)
    return val
  }

  percentString(places) {
    var self = this.rgb().round(typeof places === 'number' ? places : 1)
    var args = self.valpha === 1 ? self.color : self.color.concat(this.valpha)
    return toRgbPercent(args)
  }

  array() {
    return this.valpha === 1 ? this.color.slice() : this.color.concat(this.valpha)
  }

  object() {
    var result = {}
    var channels = colorConvert[this.model].channels
    var labels = colorConvert[this.model].labels
    for (var i = 0; i < channels; i++) {
      result[labels[i]] = this.color[i]
    }
    if (this.valpha !== 1) {
      // @ts-ignore
      result.alpha = this.valpha
    }
    return result
  }

  unitArray() {
    var rgb = this.rgb().color
    rgb[0] /= 255
    rgb[1] /= 255
    rgb[2] /= 255
    if (this.valpha !== 1) {
      rgb.push(this.valpha)
    }
    return rgb
  }

  unitObject() {
    const { color, valpha } = this.rgb()
    return {
      r: color[0] / 255,
      g: color[1] / 255,
      b: color[2] / 255,
      alpha: valpha,
    }
  }

  round(places) {
    places = Math.max(places || 0, 0)
    return new Color(this.color.map(roundToPlace(places)).concat(this.valpha), this.model)
  }

  alpha(rawVal?) {
    const val = typeof rawVal === 'function' ? rawVal(this.valpha) : rawVal
    if (arguments.length) {
      return new Color(this.color.concat(Math.max(0, Math.min(1, val))), this.model)
    }
    return this
  }

  keyword(val?) {
    if (arguments.length) {
      return new Color(val)
    }
    return colorConvert[this.model].keyword(this.color)
  }

  hex(val?) {
    if (arguments.length) {
      return new Color(val)
    }
    return toHex(this.rgb().round().color)
  }

  rgbNumber() {
    var rgb = this.rgb().color
    return ((rgb[0] & 0xff) << 16) | ((rgb[1] & 0xff) << 8) | (rgb[2] & 0xff)
  }

  luminosity() {
    // http://www.w3.org/TR/WCAG20/#relativeluminancedef
    var rgb = this.rgb().color
    var lum = []
    for (var i = 0; i < rgb.length; i++) {
      var chan = rgb[i] / 255
      lum[i] = chan <= 0.03928 ? chan / 12.92 : Math.pow((chan + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * lum[0] + 0.7152 * lum[1] + 0.0722 * lum[2]
  }

  contrast(color2) {
    // http://www.w3.org/TR/WCAG20/#contrast-ratiodef
    var lum1 = this.luminosity()
    var lum2 = color2.luminosity()
    if (lum1 > lum2) {
      return (lum1 + 0.05) / (lum2 + 0.05)
    }
    return (lum2 + 0.05) / (lum1 + 0.05)
  }

  level(color2) {
    var contrastRatio = this.contrast(color2)
    if (contrastRatio >= 7.1) {
      return 'AAA'
    }
    return contrastRatio >= 4.5 ? 'AA' : ''
  }

  isDark() {
    // YIQ equation from http://24ways.org/2010/calculating-color-contrast
    var rgb = this.rgb().color
    var yiq = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000
    return yiq < 128
  }

  isLight() {
    return !this.isDark()
  }

  negate() {
    var rgb = this.rgb()
    for (var i = 0; i < 3; i++) {
      rgb.color[i] = 255 - rgb.color[i]
    }
    return rgb
  }

  lighten(ratio: number) {
    var hsl = this.hsl()
    hsl.color[2] += hsl.color[2] * ratio
    return hsl
  }

  darken(ratio) {
    var hsl = this.hsl()
    hsl.color[2] -= hsl.color[2] * ratio
    return hsl
  }

  saturate(ratio) {
    var hsl = this.hsl()
    hsl.color[1] += hsl.color[1] * ratio
    return hsl
  }

  desaturate(ratio) {
    var hsl = this.hsl()
    hsl.color[1] -= hsl.color[1] * ratio
    return hsl
  }

  whiten(ratio) {
    var hwb = this.hwb()
    hwb.color[1] += hwb.color[1] * ratio
    return hwb
  }

  blacken(ratio) {
    var hwb = this.hwb()
    hwb.color[2] += hwb.color[2] * ratio
    return hwb
  }

  grayscale() {
    // http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
    var rgb = this.rgb().color
    var val = rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11
    return Color.rgb(val, val, val)
  }

  fade(ratio) {
    return this.alpha(this.valpha - this.valpha * ratio)
  }

  opaquer(ratio) {
    return this.alpha(this.valpha + this.valpha * ratio)
  }

  rotate(degrees) {
    var hsl = this.hsl()
    var hue = hsl.color[0]
    hue = (hue + degrees) % 360
    hue = hue < 0 ? 360 + hue : hue
    hsl.color[0] = hue
    return hsl
  }

  mix(mixinColor, weight = 0.5) {
    // ported from sass implementation in C
    // https://github.com/sass/libsass/blob/0e6b4a2850092356aa3ece07c6b249f0221caced/functions.cpp#L209
    var color1 = mixinColor.rgb()
    var color2 = this.rgb()
    var p = weight
    var w = 2 * p - 1
    var a = color1.valpha - color2.valpha
    var w1 = ((w * a === -1 ? w : (w + a) / (1 + w * a)) + 1) / 2.0
    var w2 = 1 - w1
    return Color.rgb(
      w1 * color1.red() + w2 * color2.red(),
      w1 * color1.green() + w2 * color2.green(),
      w1 * color1.blue() + w2 * color2.blue(),
      color1.valpha * p + color2.valpha * (1 - p),
    )
  }

  get red() {
    return getset(this, 'rgb', 0, maxfn(255))
  }

  get green() {
    return getset(this, 'rgb', 1, maxfn(255))
  }

  get blue() {
    return getset(this, 'rgb', 2, maxfn(255))
  }

  get hue() {
    return getset(this, ['hsl', 'hsv', 'hsl', 'hwb'], 0, function(val) {
      return ((val % 360) + 360) % 360
    })
  }

  get saturationl() {
    return getset(this, 'hsl', 1, maxfn(100))
  }

  get lightness() {
    return getset(this, 'hsl', 2, maxfn(100))
  }

  get saturationv() {
    return getset(this, 'hsv', 1, maxfn(100))
  }

  get value() {
    return getset(this, 'hsv', 2, maxfn(100))
  }

  get white() {
    return getset(this, 'hwb', 1, maxfn(100))
  }

  get wblack() {
    return getset(this, 'hwb', 2, maxfn(100))
  }
}

// model conversion methods and static constructors
Object.keys(colorConvert).forEach(function(model) {
  if (skippedModels.indexOf(model) !== -1) {
    return
  }
  var channels = colorConvert[model].channels
  // conversion methods
  Color.prototype[model] = function() {
    if (this.model === model) {
      return this
    }
    if (arguments.length) {
      return new Color(arguments, model)
    }
    var newAlpha = typeof arguments[channels] === 'number' ? channels : this.valpha
    return new Color(
      assertArray(colorConvert[this.model][model].raw(this.color)).concat(newAlpha),
      model,
    )
  }
  // 'static' construction methods
  Color[model] = function(color) {
    if (typeof color === 'number') {
      color = zeroArray(slice.call(arguments), channels)
    }
    return new Color(color, model)
  }
})

function roundTo(num, places) {
  return Number(num.toFixed(places))
}

function roundToPlace(places) {
  return function(num) {
    return roundTo(num, places)
  }
}

function getset(color: Color, model, channel, modifier?) {
  model = Array.isArray(model) ? model : [model]
  model.forEach(function(m) {
    ;(limiters[m] || (limiters[m] = []))[channel] = modifier
  })
  model = model[0]
  return function(val?) {
    var result
    if (arguments.length) {
      if (modifier) {
        val = modifier(val)
      }
      result = color[model]()
      result.color[channel] = val
      return result
    }
    result = color[model]().color[channel]
    if (modifier) {
      result = modifier(result)
    }
    return result
  }
}

function maxfn(max) {
  return function(v) {
    return Math.max(0, Math.min(max, v))
  }
}

function assertArray(val) {
  return Array.isArray(val) ? val : [val]
}

function zeroArray(arr, length) {
  for (var i = 0; i < length; i++) {
    if (typeof arr[i] !== 'number') {
      arr[i] = 0
    }
  }
  return arr
}
