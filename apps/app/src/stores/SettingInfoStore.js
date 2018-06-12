import { Bit, Job } from '@mcro/models'

export class SettingInfoStore {
  version = 0
  job = null
  bitsCount = null
  bit = null

  get setting() {
    if (!this.bit) {
      return
    }
    return this.props.appStore.settings[this.bit.integration]
  }

  setBit = bit => {
    this.bit = bit
  }

  async willMount() {
    this.setInterval(this.update, 1000)
    this.update()
  }

  update = async () => {
    const { integration } = this.bit
    const job = await Job.findOne({
      where: { type: integration },
      order: { createdAt: 'DESC' },
    })
    if (!this.job || JSON.stringify(job) !== JSON.stringify(this.job)) {
      this.job = job
      this.version += 1
    }
    const bitsCount = await Bit.createQueryBuilder()
      .where({ integration })
      .getCount()
    if (bitsCount !== this.bitsCount) {
      this.bitsCount = bitsCount
      this.version += 1
    }
  }
}
