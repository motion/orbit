const Slate = require('slate')
const { List } = require('immutable')
const isList = require('../isList')

function archiveItem(currentItem, opts, transform, ordered, data) {
  const nextData = currentItem.data.set(
    'archive',
    !(currentItem.data.get('archive') || false)
  )
  transform.setNodeByKey(currentItem.key, { data: nextData })
  return transform
}

module.exports = archiveItem
