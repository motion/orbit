const unwrapList = require('./transforms/unwrapList')
const getCurrentItem = require('./getCurrentItem')
const getPreviousItem = require('./getPreviousItem')

/**
 * User pressed Delete in an editor
 */
function onBackspace(event, data, state, opts) {
  const { startOffset, selection } = state

  // ... in a list
  const currentItem = getCurrentItem(opts, state)
  if (!currentItem) return

  const previousItem = getPreviousItem(opts, state)

  /*
  if the item is empty, delete the item and go to the previous line
  unless we're in the first item. Then behave normally
  */
  const text = currentItem.getFirstText().text

  if (text === '' && previousItem !== null) {
    let transform = state.transform()
    transform = transform.removeNodeByKey(currentItem.key).apply()
    return transform
  }

  // Only unwrap...
  // ... with a collapsed selection
  if (selection.isExpanded) return

  // ... when at the beginning of nodes
  if (startOffset > 0) return
  // ... more precisely at the beginning of the current item
  if (!selection.isAtStartOf(currentItem)) {
    return
  }

  event.preventDefault()
  return unwrapList(opts, state.transform()).apply()
}

module.exports = onBackspace
