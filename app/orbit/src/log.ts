import { Logger } from '@mcro/logger'
export const log = new Logger(process.env.SUB_PROCESS || 'main')
