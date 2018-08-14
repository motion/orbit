var defaults = require('lodash.defaults')
var isPlainObj = require('is-plain-obj')
var render = require('./src/render')
var sanitize = require('./src/sanitize')

var defaultOptions = {
  sanitize: true,
  nofollow: false,
  linkify: true,
  prefixHeadingIds: true,
  enableHeadingLinkIcons: true,
  debug: false,
  headingAnchorClass: 'anchor',
  headingLinks: true,
  headingSvgClass: ['octicon', 'octicon-link'],
}

var marky = (module.exports = function(markdown, options) {
  var html

  if (typeof markdown !== 'string') {
    throw Error('first argument must be a string')
  }
  if (typeof options !== 'undefined' && !isPlainObj(options)) {
    throw Error('second argument must be an object')
  }

  options = options || {}
  defaults(options, defaultOptions)

  html = render(markdown, options)

  if (options.sanitize) {
    html = sanitize(html, options)
  }

  return html
})

marky.parsePackageDescription = function(description) {
  return sanitize(render.renderPackageDescription(description), defaultOptions)
}

marky.getParser = function(options) {
  options = options || {}

  var parser = render.getParser(defaults(options, defaultOptions))

  if (options.sanitize) {
    var originalRender = parser.render
    parser.render = function(markdown) {
      return sanitize(originalRender.call(parser, markdown), options)
    }
  }
  return parser
}
