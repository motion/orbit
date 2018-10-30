import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import {
  GithubRepositoryModel,
  SettingForceSyncCommand,
  SettingRemoveCommand,
  SlackSourceBlacklistCommand,
  SlackSourceValues,
} from '@mcro/models'
import { GithubSource } from '@mcro/models'
import { GithubLoader } from '@mcro/services'
import { getRepository } from 'typeorm'
import { SettingEntity } from '@mcro/entities'

const log = new Logger('resolver:github-repositories')

export const GithubRepositoryManyResolver = resolveMany(
  GithubRepositoryModel,
  async ({ settingId }) => {
    const setting = await getRepository(SettingEntity).findOne({
      id: settingId,
      type: 'github',
    })
    if (!setting) {
      log.error('cannot find requested setting', { settingId })
      return
    }

    log.timer('load user repositories', { setting })
    const loader = new GithubLoader(setting as GithubSource, log)
    const repositories = await loader.loadUserRepositories()
    log.timer('load user repositories', repositories)
    return repositories
  },
)
