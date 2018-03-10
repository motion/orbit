import PG from './pg.json'
import { Thing, Setting } from '@mcro/models'

export default {
  async hasRun() {
    const { values } = await Setting.get({ type: 'data-sources' })
    return values.pg && values.pg.title === 'Paul Graham'
  },
  async run() {
    const setting = await Setting.get({ type: 'data-sources' })
    await setting.update({
      values: { ...setting.values, pg: { title: 'Paul Graham' } },
    })
    for (const item of PG) {
      console.log('creating thing', item)
      await Thing.create({
        title: item.title,
        body: item.text,
        integration: 'web',
        type: 'document',
        bucket: 'pg',
      })
    }
  },
}
