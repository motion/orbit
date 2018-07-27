/* MIT license */
import { cssColorNames } from './cssColorNames'

// NOTE: conversions should only return primitive values (i.e. arrays, or
//       values that give correct `typeof` results).
//       do not use box values types (i.e. Number(), String(), etc.)

var reverseKeywords = {}
for (var key in cssColorNames) {
  if (cssColorNames.hasOwnProperty(key)) {
    reverseKeywords[cssColorNames[key]] = key
  }
}

export const colorConversions = {
  rgb: { channels: 3, labels: 'rgb' },
  hsl: { channels: 3, labels: 'hsl' },
  hsv: { channels: 3, labels: 'hsv' },
  hwb: { channels: 3, labels: 'hwb' },
  hex: { channels: 1, labels: ['hex'] },
  keyword: { channels: 1, labels: ['keyword'] },
}

// hide .channels and .labels properties
for (var model in colorConversions) {
  // @ts-ignore
  if (colorConversions.hasOwnProperty(model)) {
    if (!('channels' in colorConversions[model])) {
      throw new Error('missing channels property: ' + model)
    }

    if (!('labels' in colorConversions[model])) {
      throw new Error('missing channel labels property: ' + model)
    }

    if (
      colorConversions[model].labels.length !== colorConversions[model].channels
    ) {
      throw new Error('channel and label counts mismatch: ' + model)
    }

    var channels = colorConversions[model].channels
    var labels = colorConversions[model].labels
    delete colorConversions[model].channels
    delete colorConversions[model].labels
    Object.defineProperty(colorConversions[model], 'channels', {
      value: channels,
    })
    Object.defineProperty(colorConversions[model], 'labels', { value: labels })
  }
}

// @ts-ignore
colorConversions.rgb.hsl = function(rgb) {
  var r = rgb[0] / 255
  var g = rgb[1] / 255
  var b = rgb[2] / 255
  var min = Math.min(r, g, b)
  var max = Math.max(r, g, b)
  var delta = max - min
  var h
  var s
  var l

  if (max === min) {
    h = 0
  } else if (r === max) {
    h = (g - b) / delta
  } else if (g === max) {
    h = 2 + (b - r) / delta
  } else if (b === max) {
    h = 4 + (r - g) / delta
  }

  h = Math.min(h * 60, 360)

  if (h < 0) {
    h += 360
  }

  l = (min + max) / 2

  if (max === min) {
    s = 0
  } else if (l <= 0.5) {
    s = delta / (max + min)
  } else {
    s = delta / (2 - max - min)
  }

  return [h, s * 100, l * 100]
}

// @ts-ignore
colorConversions.rgb.hsv = function(rgb) {
  var rdif
  var gdif
  var bdif
  var h
  var s

  var r = rgb[0] / 255
  var g = rgb[1] / 255
  var b = rgb[2] / 255
  var v = Math.max(r, g, b)
  var diff = v - Math.min(r, g, b)
  var diffc = function(c) {
    return (v - c) / 6 / diff + 1 / 2
  }

  if (diff === 0) {
    h = s = 0
  } else {
    s = diff / v
    rdif = diffc(r)
    gdif = diffc(g)
    bdif = diffc(b)

    if (r === v) {
      h = bdif - gdif
    } else if (g === v) {
      h = 1 / 3 + rdif - bdif
    } else if (b === v) {
      h = 2 / 3 + gdif - rdif
    }
    if (h < 0) {
      h += 1
    } else if (h > 1) {
      h -= 1
    }
  }

  return [h * 360, s * 100, v * 100]
}

// @ts-ignore
colorConversions.rgb.hwb = function(rgb) {
  var r = rgb[0]
  var g = rgb[1]
  var b = rgb[2]
  // @ts-ignore
  var h = colorConversions.rgb.hsl(rgb)[0]
  var w = (1 / 255) * Math.min(r, Math.min(g, b))

  b = 1 - (1 / 255) * Math.max(r, Math.max(g, b))

  return [h, w * 100, b * 100]
}

/**
 * See https://en.m.wikipedia.org/wiki/Euclidean_distance#Squared_Euclidean_distance
 * */
function comparativeDistance(x, y) {
  return (
    Math.pow(x[0] - y[0], 2) +
    Math.pow(x[1] - y[1], 2) +
    Math.pow(x[2] - y[2], 2)
  )
}

// @ts-ignore
colorConversions.keyword.rgb = function(keyword) {
  return cssColorNames[keyword]
}

// @ts-ignore
colorConversions.rgb.keyword = function(rgb) {
  var reversed = reverseKeywords[rgb]
  if (reversed) {
    return reversed
  }

  var currentClosestDistance = Infinity
  var currentClosestKeyword

  for (var keyword in cssColorNames) {
    if (cssColorNames.hasOwnProperty(keyword)) {
      var value = cssColorNames[keyword]

      // Compute comparative distance
      var distance = comparativeDistance(rgb, value)

      // Check if its less, if so set as closest
      if (distance < currentClosestDistance) {
        currentClosestDistance = distance
        currentClosestKeyword = keyword
      }
    }
  }

  return currentClosestKeyword
}

// @ts-ignore
colorConversions.hsl.rgb = function(hsl) {
  var h = hsl[0] / 360
  var s = hsl[1] / 100
  var l = hsl[2] / 100
  var t1
  var t2
  var t3
  var rgb
  var val

  if (s === 0) {
    val = l * 255
    return [val, val, val]
  }

  if (l < 0.5) {
    t2 = l * (1 + s)
  } else {
    t2 = l + s - l * s
  }

  t1 = 2 * l - t2

  rgb = [0, 0, 0]
  for (var i = 0; i < 3; i++) {
    t3 = h + (1 / 3) * -(i - 1)
    if (t3 < 0) {
      t3++
    }
    if (t3 > 1) {
      t3--
    }

    if (6 * t3 < 1) {
      val = t1 + (t2 - t1) * 6 * t3
    } else if (2 * t3 < 1) {
      val = t2
    } else if (3 * t3 < 2) {
      val = t1 + (t2 - t1) * (2 / 3 - t3) * 6
    } else {
      val = t1
    }

    rgb[i] = val * 255
  }

  return rgb
}

// @ts-ignore
colorConversions.hsl.hsv = function(hsl) {
  var h = hsl[0]
  var s = hsl[1] / 100
  var l = hsl[2] / 100
  var smin = s
  var lmin = Math.max(l, 0.01)
  var sv
  var v

  l *= 2
  s *= l <= 1 ? l : 2 - l
  smin *= lmin <= 1 ? lmin : 2 - lmin
  v = (l + s) / 2
  sv = l === 0 ? (2 * smin) / (lmin + smin) : (2 * s) / (l + s)

  return [h, sv * 100, v * 100]
}

// @ts-ignore
colorConversions.hsv.rgb = function(hsv) {
  var h = hsv[0] / 60
  var s = hsv[1] / 100
  var v = hsv[2] / 100
  var hi = Math.floor(h) % 6

  var f = h - Math.floor(h)
  var p = 255 * v * (1 - s)
  var q = 255 * v * (1 - s * f)
  var t = 255 * v * (1 - s * (1 - f))
  v *= 255

  switch (hi) {
    case 0:
      return [v, t, p]
    case 1:
      return [q, v, p]
    case 2:
      return [p, v, t]
    case 3:
      return [p, q, v]
    case 4:
      return [t, p, v]
    case 5:
      return [v, p, q]
  }
}

// @ts-ignore
colorConversions.hsv.hsl = function(hsv) {
  var h = hsv[0]
  var s = hsv[1] / 100
  var v = hsv[2] / 100
  var vmin = Math.max(v, 0.01)
  var lmin
  var sl
  var l

  l = (2 - s) * v
  lmin = (2 - s) * vmin
  sl = s * vmin
  sl /= lmin <= 1 ? lmin : 2 - lmin
  sl = sl || 0
  l /= 2

  return [h, sl * 100, l * 100]
}

// http://dev.w3.org/csswg/css-color/#hwb-to-rgb
// @ts-ignore
colorConversions.hwb.rgb = function(hwb) {
  var h = hwb[0] / 360
  var wh = hwb[1] / 100
  var bl = hwb[2] / 100
  var ratio = wh + bl
  var i
  var v
  var f
  var n

  // wh + bl cant be > 1
  if (ratio > 1) {
    wh /= ratio
    bl /= ratio
  }

  i = Math.floor(6 * h)
  v = 1 - bl
  f = 6 * h - i

  if ((i & 0x01) !== 0) {
    f = 1 - f
  }

  n = wh + f * (v - wh) // linear interpolation

  var r
  var g
  var b
  switch (i) {
    default:
    case 6:
    case 0:
      r = v
      g = n
      b = wh
      break
    case 1:
      r = n
      g = v
      b = wh
      break
    case 2:
      r = wh
      g = v
      b = n
      break
    case 3:
      r = wh
      g = n
      b = v
      break
    case 4:
      r = n
      g = wh
      b = v
      break
    case 5:
      r = v
      g = wh
      b = n
      break
  }

  return [r * 255, g * 255, b * 255]
}

// @ts-ignore
colorConversions.rgb.hex = function(args) {
  var integer =
    ((Math.round(args[0]) & 0xff) << 16) +
    ((Math.round(args[1]) & 0xff) << 8) +
    (Math.round(args[2]) & 0xff)

  var string = integer.toString(16).toUpperCase()
  return '000000'.substring(string.length) + string
}

// @ts-ignore
colorConversions.hex.rgb = function(args) {
  var match = args.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i)
  if (!match) {
    return [0, 0, 0]
  }

  var colorString = match[0]

  if (match[0].length === 3) {
    colorString = colorString
      .split('')
      .map(function(char) {
        return char + char
      })
      .join('')
  }

  var integer = parseInt(colorString, 16)
  var r = (integer >> 16) & 0xff
  var g = (integer >> 8) & 0xff
  var b = integer & 0xff

  return [r, g, b]
}
