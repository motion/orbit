var defaults = require('lodash.defaults')
var isPlainObj = require('is-plain-obj')
var render = require('./lib/render')
var sanitize = require('./lib/sanitize')

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

  var log = function(msg) {
    if (options.debug) {
      console.log('marky-markdown: ' + msg)
    }
  }

  log('\n\n' + markdown + '\n\n')

  log('Parse markdown into HTML')
  html = render(markdown, options)

  if (options.sanitize) {
    log('Sanitize malicious or malformed HTML')
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
