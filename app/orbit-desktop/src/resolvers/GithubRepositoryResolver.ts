import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { AppBitEntity, GithubApp, GithubRepositoryModel } from '@mcro/models'
import { GithubLoader } from '@mcro/services'
import { getRepository } from 'typeorm'

const log = new Logger('resolver:github-repositories')

export const GithubRepositoryManyResolver = resolveMany(
  GithubRepositoryModel,
  async ({ appId }) => {
    const app = await getRepository(AppBitEntity).findOne({
      id: appId,
      appType: 'github',
    })
    if (!app) {
      log.error('cannot find requested app', { appId })
      return
    }

    log.timer('load user repositories', { app })
    const loader = new GithubLoader(app as GithubApp, log)
    const repositories = await loader.loadUserRepositories()
    log.timer('load user repositories', repositories)
    return repositories
  },
)
