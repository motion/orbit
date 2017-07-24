// @flow
import { store } from '@mcro/black'
import { API_URL } from '~/constants'
import { Thread } from '~/app'

@store
export default class RecStore {
  docs = Thread.find()

  start() {}

  getTag = async phrase => {
    const phrases = {}
    const docs = this.docs || []

    docs.forEach(doc => {
      const tags = doc.tags()

      if (tags.length > 0) {
        if (!phrases[tags[0]]) phrases[tags[0]] = []
        phrases[tags[0]].push(doc.text)
      }
    })

    const chars = phrase.replace(/^\w /g, '')
    return await (await fetch(
      `${API_URL}/rec?phrase=${chars}&phrases=${JSON.stringify(phrases)}`
    )).json()
  }
}
