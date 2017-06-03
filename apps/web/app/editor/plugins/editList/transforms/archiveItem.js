const Slate = require('slate')
const { List } = require('immutable')
const isList = require('../isList')

function archiveItem(currentItem, opts, transform, ordered, data) {
  const isArchived = currentItem.data.get('archive') || false

  transform.setNodeByKey(currentItem.key, { data: { archive: !isArchived } })
  return transform
}

module.exports = archiveItem
