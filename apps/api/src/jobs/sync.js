// @flow
import { Job } from '@mcro/models'
import type { Observable } from 'rxjs'

//  Jobs:
//     0 - new
//     1 - running
//     2 - finished
//     3 - error

export default class TSNE {
  locks: Set<string> = new Set()
  watching: Observable

  activate = () => {
    this.watcher = Job.pending().$.subscribe(async jobs => {
      for (const job of jobs) {
        if (this.locks.has(job.id)) {
          return
        }
        this.locks.add(job.id)
        try {
          await this.runJob(job)
        } catch (e) {
          console.log('ERROR', e)
          await job.update({ status: 3, lastError: e.message, tries: 3 })
        }
        this.locks.delete(job.id)
      }
    })
  }

  dispose = () => {
    this.watcher.unsubscribe()
  }

  runJob = async (job: Job) => {
    console.log('Running', job.id)
    if (!job.options) {
      await job.update({ status: 3, lastError: 'no options on job', tries: 3 })
      return
    }

    // Reset percentage from last invocations
    await job.update({
      percent: 0,
      status: 1,
      tries: job.tries + 1,
    })

    let percent = 0

    // stop timer
    percent = 100
    // update job
    await job.update({ percent: 100, status: 2 })
  }
}
