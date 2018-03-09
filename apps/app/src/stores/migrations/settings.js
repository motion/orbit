import { Setting } from '@mcro/models'

export default {
  async hasRun() {
    return await Setting.get({ type: 'data-sources' })
  },
  async run() {
    await Setting.create({ type: 'data-sources' })
  },
}
