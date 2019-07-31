const loaderUtils = require('loader-utils')
const SourceNode = require('source-map').SourceNode
const SourceMapConsumer = require('source-map').SourceMapConsumer

module.exports = function addSourceLoader(source, sourceMap) {
  if (this.cacheable) this.cacheable()
  const options = loaderUtils.getOptions(this)
  const prefix = options.prefix || ''
  const postfix = options.postfix || ''
  if (sourceMap) {
    var currentRequest = loaderUtils.getCurrentRequest(this)
    var node = SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(sourceMap))
    node.prepend(prefix)
    node.add(postfix)
    var result = node.toStringWithSourceMap({
      file: currentRequest,
    })
    this.callback(null, result.code, result.map.toJSON())
    return
  }
  return prefix + source + postfix
}
