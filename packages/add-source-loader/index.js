const loaderUtils = require('loader-utils')
const SourceNode = require('source-map').SourceNode
const SourceMapConsumer = require('source-map').SourceMapConsumer

const BANNER = '/** Imports from add-source-loader **/\n'

module.exports = function addSourceLoader(source, sourceMap) {
  if (this.cacheable) this.cacheable()
  const options = loaderUtils.getOptions(this)
  const addImports = options.imports
  let imports = []
  for (const path of addImports) {
    imports.push(`require('${path}');`)
  }
  var prefix = BANNER + imports.join('\n') + '\n\n'
  if (sourceMap) {
    var currentRequest = loaderUtils.getCurrentRequest(this)
    var node = SourceNode.fromStringWithSourceMap(source, new SourceMapConsumer(sourceMap))
    node.prepend(prefix)
    var result = node.toStringWithSourceMap({
      file: currentRequest,
    })
    this.callback(null, result.code, result.map.toJSON())
    return
  }
  return prefix + source
}
