import { every, uniq, includes } from 'lodash'

const stamp = m => +(m.ts.split('.')[0] + '000')

export default (messages, search = []) => {
  let lastConvo = []
  let lastTs = 0
  let convos = []

  messages.reverse().forEach(m => {
    // console.log('time since last', stamp(m) - lastTs, text)
    if (lastConvo.length > 0 && stamp(m) - lastTs > 1000 * 60 * 20) {
      convos.push({ messages: lastConvo, stamp: stamp(m) })
      lastConvo = []
    }

    lastConvo.push({ ...m, timestamp: stamp(m), ts: undefined })
    lastTs = stamp(m)
  })
  const activeConvos =
    search === ''
      ? convos
      : convos.filter(({ messages }) => {
          const text = messages.join(' ')
          return every(search, t => includes(text.toLowerCase(), t))
        })

  /*
  activeConvos.forEach((convo, index) => {
    console.log('Conversation #' + index + ':')
    convo.messages.forEach(message => {
      console.log('  ' + message)
    })
  })
  */

  /*
  if (search.length) {
    console.log(('searching for ' + search.join(', ')).bold)
  }
  */

  return activeConvos.map(({ stamp, messages }) => ({
    authors: uniq(messages.map(m => m.userName)),
    id: '' + stamp,
    data: {
      messages: messages,
      text: messages.map(m => m.text).join('\n'),
      createdAt: stamp,
    },
    type: 'convo',
  }))
}
