import { store } from '@mcro/black'
import data from './content'

@store
export default class ContentStore {
  data = data

  get things() {
    return data.map(({ title, body, integration }) => ({
      url: '',
      type: integration,
      integration,
      title,
      body,
    }))
  }
}
