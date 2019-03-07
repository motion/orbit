import { Logger } from '@o/logger'
export const log = new Logger(process.env.SUB_PROCESS || 'main')
