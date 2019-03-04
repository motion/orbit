import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { AppEntity, GithubRepositoryModel } from '@mcro/models'
import { GithubLoader } from '@mcro/apps/_/apps/github/GithubLoader' // todo(umed) fix it, we don't need to have desktop app dependency on apps
import { getRepository } from 'typeorm'

const log = new Logger('resolver:github-repositories')

export const GithubRepositoryManyResolver = resolveMany(
  GithubRepositoryModel,
  async ({ appId }) => {
    const app = await getRepository(AppEntity).findOne({
      id: appId,
      identifier: 'github',
    })
    if (!app) {
      log.error('cannot find requested app', { appId })
      return
    }

    log.timer('load user repositories', { app })
    const loader = new GithubLoader(app, log)
    const repositories = await loader.loadUserRepositories()
    log.timer('load user repositories', repositories)
    return repositories
  },
)
