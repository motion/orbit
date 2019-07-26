import { Logger } from '@o/logger'
import { resolveCommand } from '@o/mediator'
import { AppForceCancelCommand, JobEntity } from '@o/models'
import { getRepository } from 'typeorm'
import { __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS } from '@o/worker-kit'

const log = new Logger('SourceForceCancelResolver')

export const AppForceCancelResolver: any = resolveCommand(
  AppForceCancelCommand,
  async ({ appId }) => {
    log.info('canceling', appId)
    const lastJob = await getRepository(JobEntity).findOne({
      where: {
        type: 'APP_SYNC',
        status: 'PROCESSING',
        appId,
      },
      order: {
        time: 'desc',
      },
    })

    if (lastJob) {
      await getRepository(JobEntity).remove(lastJob)
      __YOURE_FIRED_IF_YOU_EVEN_REPL_PEEK_AT_THIS.cancelSyncer(appId)
    }
  },
)
