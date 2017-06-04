const getCurrentItem = require('../getCurrentItem')

/**
 * Split a list item.
 *
 * @param  {Object} opts
 * @param  {Transform} transform
 * @return {Transform} transform
 */

function splitListItem(opts, transform) {
  /* 
    modified to allow you to add an item from an archived li to create
    an unarchived one by temporarily setting archive to false in the current
    item
  */
  const { state } = transform
  const currentItem = getCurrentItem(opts, state)
  const isArchived = currentItem.data.get('archive') || false
  transform.setNodeByKey(currentItem.key, { data: { archive: false } })

  const splitOffset = currentItem.getOffsetAtRange(
    state.selection.collapseToStart()
  )
  transform.splitNodeByKey(currentItem.key, splitOffset)
  return transform.setNodeByKey(currentItem.key, {
    data: { archive: isArchived },
  })
}

module.exports = splitListItem
