import { Logger } from '@mcro/logger'
import { resolveMany } from '@mcro/mediator'
import { GithubRepositoryModel } from '@mcro/models'
import { getRepository } from 'typeorm'
import {
  SlackSettingBlacklistCommand,
  SlackSettingValues,
  SettingForceSyncCommand,
  SettingRemoveCommand,
} from '@mcro/models'
import { SettingEntity } from '../entities/SettingEntity'
import { GithubLoader } from '../loaders/github/GithubLoader'

const log = new Logger(`resolver:github-repositories`)

export const GithubRepositoryManyResolver = resolveMany(
  GithubRepositoryModel,
  async ({ settingId }) => {

    const setting = await getRepository(SettingEntity).findOne({
      id: settingId,
      type: 'github',
    })
    if (!setting) {
      log.error(`cannot find requested setting`, { settingId })
      return
    }

    log.info(`loading repositories from the github`, { setting })
    const loader = new GithubLoader(setting)
    const repositories = await loader.loadRepositories()
    log.info(`loaded repositories`, repositories)
    return repositories
  },
)
