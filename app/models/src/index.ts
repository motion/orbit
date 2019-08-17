import { Bit } from './interfaces/Bit'

export * from './defaultValues/userDefaultValue'
export * from './entities/index.node'
export * from './interfaces/AppBit'
export * from './interfaces/Bit'
export * from './interfaces/BitContentType'
export * from './interfaces/commands'
export * from './interfaces/ItemType'
export * from './interfaces/Job'
export * from './interfaces/JobStatus'
export * from './interfaces/JobType'
export * from './interfaces/Location'
export * from './interfaces/SpaceInterface'
export * from './interfaces/Setting'
export * from './interfaces/User'
export * from './interfaces/State'
export * from './models'

export * from './AppDefinition'
export * from './AppViewProps'
export * from './ApiInfo'
export * from './ApiSearchItem'
export * from './AppWorker'
export * from './AppWorkerUtils'

// todo: find a good place for this function
// TODO could return title/body separately when improving search
export const getSearchableText = (bit: Bit): string => {
  if (bit.type === 'conversation') {
    // TODO make a generic conversation bit data type
    const data = bit.data
    return data.messages
      .map(x => `${x.user || ''} ${x.text || ''}`)
      .join(' ')
      .trim()
  }
  return `${bit.title} ${bit.body}`.trim()
}
