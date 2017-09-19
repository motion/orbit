// @flow
import { ensureJob } from '~/jobs/helpers'

export default class Syncer {
  JOBS_CHECK_INTERVAL = 1000 * 10 // 10 seconds

  constructor({ user }) {
    this.runSyncer()
    this.user = user
  }

  async runSyncer(): Promise<void> {
    console.log('Started syncer', this.constructor.jobs)
    // every so often
    setInterval(this.syncJobs, this.JOBS_CHECK_INTERVAL)
    this.syncJobs()
  }

  async syncJobs(): Promise<void> {
    const { type, jobs } = this.constructor
    if (!jobs) {
      return
    }
    const syncers = []
    for (const action of Object.keys(jobs)) {
      const job = jobs[action]
      syncers.push(ensureJob(type, action, job))
    }
    await Promise.all(syncers)
  }
}
