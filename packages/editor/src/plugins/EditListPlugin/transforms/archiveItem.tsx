const Slate = require('slate')
const { List } = require('immutable')
const isList = require('../isList')

function archiveItem(currentItem, opts, transform, ordered, data) {
  const toArchive = !(currentItem.data.get('archive') || false)
  const nextData = currentItem.data.set('archive', toArchive)
  if (toArchive) Sound.play('success')
  transform.setNodeByKey(currentItem.key, { data: nextData })
  return transform
}

module.exports = archiveItem
