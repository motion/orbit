import { Logger } from '@mcro/logger'
const { IS_DESKTOP } = process.env
const name = IS_DESKTOP ? 'desktop' : 'electron'
export const log = new Logger(name)
