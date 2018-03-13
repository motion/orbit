import data from './books.json'
import { Thing, Setting } from '@mcro/models'

const title = 'Books'
const bucket = 'books'

export default {
  async hasRun() {
    const { values } = await Setting.get({ type: 'data-sources' })
    return values[bucket] && values[bucket].title === title
  },
  async run() {
    const setting = await Setting.get({ type: 'data-sources' })
    await setting.update({
      values: { ...setting.values, [bucket]: { title } },
    })
    await Promise.all(
      data.map(item =>
        Thing.create({
          title: item.title,
          body: item.text,
          integration: 'web',
          type: 'document',
          bucket,
        }),
      ),
    )
  },
}
