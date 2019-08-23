const { List } = require('immutable')
const isList = require('./isList')
const getCurrentItem = require('./getCurrentItem')

/**
 * Return the list of items at the given range. The returned items are
 * the highest list item blocks that cover the range.
 *
 * @param {PluginOptions} opts
 * @param {Slate.Node} state
 * @param {Slate.Selection} [range]
 * @return {List<Slate.Block>} Empty if no list of items can cover the range
 */
function getItemsAtRange(opts, state, range) {
  range = range || state.selection

  if (!range.startKey) {
    return List()
  }

  const { document } = state

  const startBlock = document.getClosestBlock(range.startKey)
  const endBlock = document.getClosestBlock(range.endKey)

  if (startBlock === endBlock) {
    const item = getCurrentItem(opts, state, startBlock)
    return item ? List([item]) : List()
  }

  const ancestor = document.getCommonAncestor(startBlock.key, endBlock.key)

  if (isList(opts, ancestor)) {
    const startPath = ancestor.getPath(startBlock.key)
    const endPath = ancestor.getPath(endBlock.key)

    return ancestor.nodes.slice(startPath[0], endPath[0] + 1)
  } else if (ancestor.type === opts.typeItem) {
    // The ancestor is the highest list item that covers the range
    return List([ancestor])
  } else {
    // No list of items can cover the range
    return List()
  }
}

module.exports = getItemsAtRange
