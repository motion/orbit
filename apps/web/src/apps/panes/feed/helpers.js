import { format } from 'date-fns'
import { sum, every, uniq, includes } from 'lodash'

export default (messages, search = []) => {
  let lastConvo = []
  let lastTs = 0
  let convos = []
  let convoStamps = []

  messages.reverse().forEach(m => {
    const text =
      '#' + m.channel + m.userName +
      ' ' +
      format(+m.ts, 'HH:mm') +
      '[]: ' +
      m.text

    // console.log('time since last', +m.ts - lastTs, text)
    if (+m.ts - lastTs > 1000 * 60 * 20) {
      convos.push({ messages: lastConvo, stamp: +m.ts })
      lastConvo = []
    }

    lastConvo.push(text)
    lastTs = +m.ts
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
    authors: uniq(messages.map(m => m.fullName)),
    data: {
      messages: messages,
      text: messages.join('\n'),
      createdAt: stamp,
    },
    type: 'convo',
  }))
}
