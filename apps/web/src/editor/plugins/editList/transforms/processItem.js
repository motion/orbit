const Slate = require('slate')
const { List } = require('immutable')
const isList = require('../isList')

// chono doesn't support npm but is the best date library
const loadScript = url => {
  const s = document.createElement('script')
  s.type = 'text/javascript'
  s.src = url
  document.body.appendChild(s)
}

const chronoUrl = `https://cdn.jsdelivr.net/chrono/1.3/chrono.min.js`

loadScript(chronoUrl)

function processItem(currentItem, opts, transform, ordered) {
  if (typeof chrono === 'undefined') return transform
  // return transform
  const date = chrono.parse(currentItem.text)[0]
  if (!date) return transform

  const now = new Date()
  const {
    year = now.getFullYear(),
    month = now.getMonth() + 1,
    day = now.getDay(),
  } = date.start.knownValues
  // it doesn't 0 index its dates. Round up a day to simulate "end of the day"
  const due = +new Date(year, month - 1, day + 1)
  const data = currentItem.data.set('due', due).toJS()

  transform.setNodeByKey(currentItem.key, { data })
  const text = currentItem.getFirstText()
  const prefix = ['due', 'by']
  const remove = new RegExp(`(${prefix.join('|')})? ${date.text}`)
  transform.removeTextByKey(text, 0, text.length)
  transform.insertTextByKey(
    currentItem.getFirstText(),
    0,
    currentItem.text.replace(remove, '')
  )
  return transform
}

module.exports = processItem
