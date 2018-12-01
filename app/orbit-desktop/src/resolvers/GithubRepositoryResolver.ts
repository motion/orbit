import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { GithubRepositoryModel } from '@mcro/models'
import { GithubSource } from '@mcro/models'
import { GithubLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { SourceEntity } from '@mcro/models'

const log = new Logger('resolver:github-repositories')

export const GithubRepositoryManyResolver = resolveMany(
  GithubRepositoryModel,
  async ({ sourceId }) => {
    const source = await getRepository(SourceEntity).findOne({
      id: sourceId,
      type: 'github',
    })
    if (!source) {
      log.error('cannot find requested source', { sourceId })
      return
    }

    log.timer('load user repositories', { source })
    const loader = new GithubLoader(source as GithubSource, log)
    const repositories = await loader.loadUserRepositories()
    log.timer('load user repositories', repositories)
    return repositories
  },
)
