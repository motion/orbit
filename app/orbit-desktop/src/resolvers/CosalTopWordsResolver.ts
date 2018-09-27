import { SettingEntity } from '@mcro/entities'
import { Logger } from '@mcro/logger'
import { resolveCommand, resolveMany } from '@mcro/mediator'
import {
  CosalTopWordsCommand,
  SettingRemoveCommand,
  SlackChannelModel,
  SlackSettingBlacklistCommand,
  SlackSettingValues,
} from '@mcro/models'
import { SlackLoader } from '@mcro/services'

const log = new Logger(`resolver:cosal-top-words`)

export const CosalTopWordsResolver = resolveCommand(
  CosalTopWordsCommand,
  async ({ text, max }) => {
    log.info(`getting top worlds for`, text)
    return []
  },
)
