import { getGlobalConfig } from '@o/config'
import { MediatorClient } from '@o/mediator'

import { Mediator } from './Mediator'

const Config = getGlobalConfig()
const hasCommands = !!Config && typeof window !== 'undefined'

export const command: MediatorClient['command'] = hasCommands
  ? Mediator.command.bind(Mediator)
  : undefined

export const observeMany: MediatorClient['observeMany'] = hasCommands
  ? Mediator.observeMany.bind(Mediator)
  : undefined

export const observeOne: MediatorClient['observeOne'] = hasCommands
  ? Mediator.observeOne.bind(Mediator)
  : undefined

export const observeCount: MediatorClient['observeCount'] = hasCommands
  ? Mediator.observeCount.bind(Mediator)
  : undefined

export const loadMany: MediatorClient['loadMany'] = hasCommands
  ? Mediator.loadMany.bind(Mediator)
  : undefined

export const loadOne: MediatorClient['loadOne'] = hasCommands
  ? Mediator.loadOne.bind(Mediator)
  : undefined

export const loadCount: MediatorClient['loadCount'] = hasCommands
  ? Mediator.loadCount.bind(Mediator)
  : undefined

export const save: MediatorClient['save'] = hasCommands ? Mediator.save.bind(Mediator) : undefined

export const remove: MediatorClient['remove'] = hasCommands
  ? Mediator.remove.bind(Mediator)
  : undefined
