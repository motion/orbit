const getCurrentItem = require('../getCurrentItem')

export default function splitChild(opts, transform) {
  /* 
    modified to allow you to add an item from an archived li to create
    an unarchived one by temporarily setting archive to false in the current
    item
  */
  transform.collapseToStartOfNextBlock()
  const { state } = transform
  const currentItem = getCurrentItem(opts, state)
  const child = currentItem.getBlocksAsArray()[1]

  const splitOffset = currentItem.getOffsetAtRange(
    state.selection.collapseToStart()
  )
  transform.splitNodeByKey(currentItem.key, splitOffset)
  return transform.collapseToStartOfPreviousBlock()
}
