import { colorConversions } from './colorConversions'
import { colorRoute } from './colorRoute'

export const colorConvert = {}

var models = Object.keys(colorConversions)

function wrapRaw(fn) {
  var wrappedFn = function(args) {
    if (args === undefined || args === null) {
      return args
    }

    if (arguments.length > 1) {
      args = Array.prototype.slice.call(arguments)
    }

    return fn(args)
  }

  // preserve .conversion property if there is one
  if ('conversion' in fn) {
    // @ts-ignore
    wrappedFn.conversion = fn.conversion
  }

  return wrappedFn
}

function wrapRounded(fn) {
  var wrappedFn = function(args) {
    if (args === undefined || args === null) {
      return args
    }

    if (arguments.length > 1) {
      args = Array.prototype.slice.call(arguments)
    }

    var result = fn(args)

    // we're assuming the result is an array here.
    // see notice in conversions.js; don't use box types
    // in conversion functions.
    if (typeof result === 'object') {
      for (var len = result.length, i = 0; i < len; i++) {
        result[i] = Math.round(result[i])
      }
    }

    return result
  }

  // preserve .conversion property if there is one
  if ('conversion' in fn) {
    // @ts-ignore
    wrappedFn.conversion = fn.conversion
  }

  return wrappedFn
}

models.forEach(function(fromModel) {
  colorConvert[fromModel] = {}

  Object.defineProperty(colorConvert[fromModel], 'channels', {
    value: colorConversions[fromModel].channels,
  })
  Object.defineProperty(colorConvert[fromModel], 'labels', {
    value: colorConversions[fromModel].labels,
  })

  var routes = colorRoute(fromModel)
  var routeModels = Object.keys(routes)

  routeModels.forEach(function(toModel) {
    var fn = routes[toModel]

    colorConvert[fromModel][toModel] = wrapRounded(fn)
    colorConvert[fromModel][toModel].raw = wrapRaw(fn)
  })
})
